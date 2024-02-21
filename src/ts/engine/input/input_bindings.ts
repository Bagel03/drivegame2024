import { ButtonState, Input } from "./input";
import { AnalogInput, DigitalInput } from "./input_types";

export type Binding = DigitalBinding | AnalogBinding;

export abstract class DigitalBinding {
    abstract is(input: Input, state: ButtonState): boolean;
}

export abstract class AnalogBinding {
    abstract get(input: Input): number;
}

export class DirectDigitalBinding extends DigitalBinding {
    constructor(public raw: DigitalInput) {
        super();
    }

    is(input: Input, state: ButtonState): boolean {
        return input.isRaw(this.raw, state);
    }
}

export class DirectAnalogBinding extends AnalogBinding {
    constructor(public raw: DigitalInput | AnalogInput) {
        super();
    }

    get(input: Input): number {
        return input.getRaw(this.raw);
    }
}

export class AllBinding extends DigitalBinding {
    public readonly inputs: DigitalInput[];
    constructor(...inputs: DigitalInput[]) {
        super();
        this.inputs = inputs;
    }

    is(inputInstance: Input, state: ButtonState): boolean {
        switch (state) {
            case "PRESSED":
            case "RELEASED":
                return this.inputs.every((input) =>
                    inputInstance.isRaw(input, state)
                );

            case "JUST_PRESSED":
                let oneJustPressed = false;
                for (const input of this.inputs) {
                    if (!inputInstance.isRaw(input, "PRESSED")) return false;
                    if (inputInstance.isRaw(input, "JUST_PRESSED"))
                        oneJustPressed = true;
                }
                return oneJustPressed;
            case "JUST_RELEASED":
                let oneJustReleased = false;
                for (const input of this.inputs) {
                    if (!inputInstance.isRaw(input, "RELEASED")) return false;
                    if (inputInstance.isRaw(input, "JUST_RELEASED"))
                        oneJustReleased = true;
                }
                return oneJustReleased;
        }
    }
}

export class AnyBinding extends DigitalBinding {
    public readonly inputs: DigitalInput[];
    constructor(...inputs: DigitalInput[]) {
        super();
        this.inputs = inputs;
    }

    is(inputInstance: Input, state: ButtonState): boolean {
        for (const input of this.inputs) {
            if (inputInstance.isRaw(input, state)) return true;
        }
        return false;
    }
}

type PartialRecord<K extends string | number | symbol, T> = { [key in K]?: T };
export class CombinedBinding<T extends number> extends AnalogBinding {
    public readonly inputs: (AnalogInput | DigitalInput)[];
    public readonly weights: number[];

    public readonly max: number;
    public readonly min: number;

    constructor(
        inputsAndWeights: { [key in AnalogInput | DigitalInput]?: number },
        { max, min }: { max: number; min: number } = {
            max: Infinity,
            min: -Infinity,
        }
    ) {
        super();
        this.max = max;
        this.min = min;
        this.inputs = Object.keys(inputsAndWeights);
        this.weights = Object.values(inputsAndWeights).filter(
            (n): n is number => n !== undefined
        );
    }

    get(input: Input) {
        let sum = 0;
        for (let i = 0; i < this.inputs.length; i++) {
            sum += input.getRaw(this.inputs[i]) * this.weights[i];
        }
        return Math.max(this.min, Math.min(this.max, sum));
    }
}

export class DeadzoneBinding extends AnalogBinding {
    public regions: number[][];

    constructor(
        public input: AnalogInput | DigitalInput,
        ...regions: [min: number, max: number, val: number][]
    ) {
        super();
        this.regions = regions;
    }

    get(inputInstance: Input): number {
        const raw = inputInstance.getRaw(this.input);

        for (const region of this.regions) {
            if (region[0] <= raw && region[1] >= raw) return region[2];
        }
        return raw;
    }
}

export class GreatestAbsBinding extends AnalogBinding {
    public inputs: (AnalogInput | DigitalInput)[];

    constructor(...inputs: (AnalogInput | DigitalInput)[]) {
        super();
        this.inputs = inputs;
    }

    get(inputInstance: Input): number {
        let greatest = 0;
        for (const input of this.inputs) {
            const val = inputInstance.getRaw(input);
            if (Math.abs(greatest) < Math.abs(val)) greatest = val;
        }

        return greatest;
    }
}

export class RemappedBinding extends AnalogBinding {
    constructor(
        public input: AnalogInput | DigitalInput,
        public options: {
            min?: number;
            max?: number;
            mult?: number;
            offset?: number;
            customFn: (num: number) => number;
        }
    ) {
        super();

        this.options.min ??= 0;
        this.options.max ??= 1;
        this.options.mult ??= 1;
        this.options.offset ??= 0;
    }

    get(input: Input): number {
        const raw = input.getRaw(this.input);

        if (this.options.customFn) return this.options.customFn(raw);

        return Math.max(
            this.options.min!,
            Math.min(
                this.options.max!,
                raw * this.options.mult! + this.options.offset!
            )
        );
    }
}

export class AngleBinding extends AnalogBinding {
    constructor(
        public readonly xInput: AnalogInput,
        public readonly yInput: AnalogInput
    ) {
        super();
    }

    get(input: Input): number {
        return Math.atan2(input.getRaw(this.yInput), input.getRaw(this.xInput));
    }
}

type inputGetter = (input: Input) => number;

export class AdvancedAngleBinding extends AnalogBinding {
    public readonly getXDiff!: inputGetter;
    public readonly getYDiff!: inputGetter;

    constructor(
        public getters: {
            targetX: AnalogInput | inputGetter;
            targetY: AnalogInput | inputGetter;
            originX: AnalogInput | inputGetter;
            originY: AnalogInput | inputGetter;
        }
    ) {
        super();

        for (const dir of ["X", "Y"] as const) {
            const origin = getters[`origin${dir}`];
            const target = getters[`target${dir}`];

            if (typeof origin === "function" && typeof target === "function") {
                this[`get${dir}Diff`] = (input) => target(input) - origin(input);
            } else if (typeof origin === "string" && typeof target === "string") {
                this[`get${dir}Diff`] = (input) =>
                    input.getRaw(target) - input.getRaw(origin);
            } else if (typeof origin === "string" && typeof target === "function") {
                this[`get${dir}Diff`] = (input) =>
                    target(input) - input.getRaw(origin);
            } else if (typeof origin === "function" && typeof target === "string") {
                this[`get${dir}Diff`] = (input) =>
                    input.getRaw(target) - origin(input);
            }
        }
    }

    get(input: Input): number {
        return Math.atan2(this.getYDiff(input), this.getXDiff(input));
    }
}

//#endregion
