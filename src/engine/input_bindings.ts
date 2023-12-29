import { AnalogBinding, AnalogInput, Binding, Input } from "./input";

export class AimAngleBinding extends AnalogBinding {
    constructor(
        public getters: {
            originX: (input: Input) => number;
            originY: (input: Input) => number;
            targetX: (input: Input) => number;
            targetY: (input: Input) => number;
        }
    ) {
        super();
    }

    get(input: Input): number {
        return Math.atan2(
            this.getters.targetY(input) - this.getters.originY(input),
            this.getters.targetX(input) - this.getters.originX(input)
        );
    }
}

export class FavorBinding extends AnalogBinding {
    public readonly inputs: (AnalogInput | AnalogBinding)[];
    constructor(...inputs: (AnalogInput | AnalogBinding)[]) {
        super();
        this.inputs = inputs;
    }

    get(input: Input): number {
        for (const item of this.inputs) {
            const result =
                item instanceof AnalogBinding ? item.get(input) : input.get(item);
            if (result !== 0) return result;
        }
        return 0;
    }
}
