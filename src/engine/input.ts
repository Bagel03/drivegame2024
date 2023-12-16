import { System, World } from "bagelecs";
import { ResourceUpdaterPlugin } from "./resource";

//#region Types
export type ButtonState =
    | "PRESSED"
    | "RELEASED"
    | "JUST_PRESSED"
    | "JUST_RELEASED";

export const BUTTON_STATES: ButtonState[] = [
    "JUST_PRESSED",
    "JUST_RELEASED",
    "PRESSED",
    "RELEASED",
];

type Key =
    | "Backspace"
    | "Tab"
    | "Enter"
    | "ShiftLeft"
    | "ShiftRight"
    | "ControlLeft"
    | "ControlRight"
    | "AltLeft"
    | "AltRight"
    | "Pause"
    | "CapsLock"
    | "Escape"
    | "Space"
    | "PageUp"
    | "PageDown"
    | "End"
    | "Home"
    | "ArrowLeft"
    | "ArrowUp"
    | "ArrowRight"
    | "ArrowDown"
    | "PrintScreen"
    | "Insert"
    | "Delete"
    | "Digit0"
    | "Digit1"
    | "Digit2"
    | "Digit3"
    | "Digit4"
    | "Digit5"
    | "Digit6"
    | "Digit7"
    | "Digit8"
    | "Digit9"
    | "KeyA"
    | "KeyB"
    | "KeyC"
    | "KeyD"
    | "KeyE"
    | "KeyF"
    | "KeyG"
    | "KeyH"
    | "KeyI"
    | "KeyJ"
    | "KeyK"
    | "KeyL"
    | "KeyM"
    | "KeyN"
    | "KeyO"
    | "KeyP"
    | "KeyQ"
    | "KeyR"
    | "KeyS"
    | "KeyT"
    | "KeyU"
    | "KeyV"
    | "KeyW"
    | "KeyX"
    | "KeyY"
    | "KeyZ"
    | "MetaLeft"
    | "MetaRight"
    | "ContextMenu"
    | "Numpad0"
    | "Numpad1"
    | "Numpad2"
    | "Numpad3"
    | "Numpad4"
    | "Numpad5"
    | "Numpad6"
    | "Numpad7"
    | "Numpad8"
    | "Numpad9"
    | "NumpadMultiply"
    | "NumpadAdd"
    | "NumpadSubtract"
    | "NumpadDecimal"
    | "NumpadDivide"
    | "F1"
    | "F2"
    | "F3"
    | "F4"
    | "F5"
    | "F6"
    | "F7"
    | "F8"
    | "F9"
    | "F10"
    | "F11"
    | "F12"
    | "NumLock"
    | "ScrollLock"
    | "Semicolon"
    | "Equal"
    | "Comma"
    | "Minus"
    | "Period"
    | "Slash"
    | "Backquote"
    | "BracketLeft"
    | "Backslash"
    | "BracketRight"
    | "Quote";

type MouseButton =
    | `Mouse${number}`
    | `MouseLeft`
    | `MouseMiddle`
    | `MouseRight`;

type GamepadKey =
    // Xbox
    | "LT"
    | "LeftTrigger"
    | "LB"
    | "LeftBumper"
    | "RT"
    | "RightTrigger"
    | "RB"
    | "RightBumper"
    | "A"
    | "B"
    | "X"
    | "Y"
    | "LeftStick"
    | "RightStick"
    | "DPadUp"
    | "DPadRight"
    | "DPadDown"
    | "DPadLeft"
    | "View"
    | "Menu"
    | "Xbox"
    // PS
    | "L1"
    | "L2"
    | "R1"
    | "R2"
    | "Triangle"
    | "Circle"
    | "Cross"
    | "Square"
    | "▲"
    | "◯"
    | "✖"
    | "□"
    | "Share"
    | "Options"
    | "PS"
    | "Touchpad";
// TODO: Switch

type GamepadButton =
    | `Gamepad${number}-${number}`
    | `Gamepad${number}-${GamepadKey}`
    | `DefaultGamepad-${number}`
    | `DefaultGamepad-${GamepadKey}`;

export type DigitalInput = Key | MouseButton | GamepadButton;

// Analog

type AnalogMouse =
    | "MouseX"
    | "MouseY"
    | "MouseXDelta"
    | "MouseYDelta"
    | "MouseScrollDelta";
type AnalogGamepad =
    | "LeftStickX"
    | "LeftStickY"
    | "RightStickX"
    | "RightStickY";

// Gamepad buttons are both analog and digital
export type AnalogInput =
    | AnalogMouse
    | GamepadButton
    | `Gamepad${number}-${AnalogGamepad}`
    | `DefaultGamepad-${AnalogGamepad}`;

//#endregion

const INPUT_ALIASES = new Map<DigitalInput, DigitalInput>([
    ["MouseLeft", "Mouse0"],
    ["MouseRight", "Mouse2"],
    ["MouseMiddle", "Mouse1"],
]);

const GAMEPAD_ALIASES = new Map<GamepadKey, number>([
    ["✖", 0],
    ["Cross", 0],
    ["A", 0],

    ["◯", 1],
    ["Circle", 1],
    ["B", 1],

    ["□", 2],
    ["Square", 2],
    ["X", 2],

    ["▲", 3],
    ["Triangle", 3],
    ["Y", 3],

    ["L1", 4],
    ["LeftBumper", 4],
    ["R1", 5],
    ["RightBumper", 5],

    ["L2", 6],
    ["LeftTrigger", 6],
    ["R2", 7],
    ["RightTrigger", 7],

    ["Share", 8],
    ["View", 8],
    ["Options", 9],
    ["Menu", 9],

    ["LeftStick", 10],
    ["RightStick", 11],

    ["DPadUp", 12],
    ["DPadDown", 13],
    ["DPadLeft", 14],
    ["DPadRight", 15],

    ["PS", 16],
    ["Xbox", 16],

    ["Touchpad", 17],
]);

export class Input {
    protected readonly digital = {
        PRESSED: new Set(),
        JUST_PRESSED: new Set(),
        JUST_RELEASED: new Set(),
        RELEASED: new Set(),

        // Queue all events to take place after the next frame (this grantees everything happens at least once)
        queue: {
            PRESSED: new Set(),
            RELEASED: new Set(),
        },
    };

    protected readonly analog: Map<AnalogInput, number> = new Map();

    protected connectedGamepads: number[] = [];
    protected defaultGamepad: number | null = null;

    protected readonly analogBindings = new Map<string, AnalogBinding>();
    protected readonly digitalBindings = new Map<string, DigitalBinding>();

    protected clearDigitalState(input: string) {
        this.digital.PRESSED.delete(input);
        this.digital.RELEASED.delete(input);
        this.digital.JUST_PRESSED.delete(input);
        this.digital.JUST_RELEASED.delete(input);
        this.digital.queue.PRESSED.delete(input);
        this.digital.queue.RELEASED.delete(input);
    }

    protected digitalInputPressed(input: string) {
        this.clearDigitalState(input);
        this.digital.queue.PRESSED.add(input);
    }

    protected digitalInputReleased(input: string) {
        this.clearDigitalState(input);
        this.digital.queue.RELEASED.add(input);
    }

    protected setAnalog(input: AnalogInput, value: number) {
        this.analog.set(input, value);
    }

    constructor(public readonly world: World) {
        this.init();
    }

    init() {
        window.addEventListener("keydown", (e: KeyboardEvent) => {
            const { code } = e;

            // There is some weird stuff with holding a key, so we need more checks
            if (
                this.digital.JUST_PRESSED.has(code) ||
                this.digital.PRESSED.has(code)
            )
                return;

            this.digitalInputPressed(code);
        });

        window.addEventListener("keyup", (e: KeyboardEvent) => {
            this.digitalInputReleased(e.code);
        });

        window.addEventListener("mousedown", (e: MouseEvent) => {
            this.digitalInputPressed(`Mouse${e.button}`);
        });

        window.addEventListener("mouseup", (e: MouseEvent) => {
            this.digitalInputReleased(`Mouse${e.button}`);
        });

        const mouseMovementParams: [AnalogInput, keyof MouseEvent][] = [
            ["MouseX", "clientX"],
            ["MouseXDelta", "movementX"],
            ["MouseY", "clientY"],
            ["MouseYDelta", "movementY"],
        ];
        window.addEventListener("mousemove", (e: MouseEvent) => {
            for (const [input, key] of mouseMovementParams) {
                this.setAnalog(input, e[key] as number);
            }
        });

        window.addEventListener("wheel", (e) => {
            this.setAnalog("MouseScrollDelta", e.deltaY);
        });

        window.addEventListener("gamepadconnected", (e) => {
            this.connectedGamepads.push(e.gamepad.index);
            this.defaultGamepad = e.gamepad.index;
        });

        window.addEventListener("gamepaddisconnected", (e: GamepadEvent) => {
            this.connectedGamepads = this.connectedGamepads.filter(
                (gpi) => gpi !== e.gamepad.index
            );

            if (this.defaultGamepad === e.gamepad.index) {
                this.defaultGamepad = null;
            }
        });
    }

    update() {
        // Move JustDid -> Did
        this.digital.JUST_PRESSED.forEach((button) => {
            this.digital.PRESSED.add(button);
        });

        this.digital.JUST_PRESSED.clear();

        this.digital.JUST_RELEASED.forEach((button) => {
            this.digital.RELEASED.add(button);
        });
        this.digital.JUST_RELEASED.clear();

        // Move QueuedDid -> JustDid
        this.digital.queue.PRESSED.forEach((b) =>
            this.digital.JUST_PRESSED.add(b)
        );
        this.digital.queue.PRESSED.clear();
        this.digital.queue.RELEASED.forEach((b) =>
            this.digital.JUST_RELEASED.add(b)
        );
        this.digital.queue.RELEASED.clear();

        this.analog.set("MouseXDelta", 0);
        this.analog.set("MouseYDelta", 0);
        this.analog.set("MouseScrollDelta", 0);

        const gamepads = navigator.getGamepads();
        if (this.defaultGamepad == null) return;

        let defaultGamepad = gamepads[this.defaultGamepad]!;
        this.connectedGamepads.forEach((gamepadIdx) => {
            const gamepad = gamepads[gamepadIdx]!;

            if (gamepad.timestamp > defaultGamepad.timestamp) {
                this.defaultGamepad = gamepad.index;
                defaultGamepad = gamepad;
            }

            gamepad.buttons.forEach((button, buttonIdx) => {
                const name = `Gamepad${gamepad.index}-${buttonIdx}` as const;
                this.analog.set(name, button.value);

                if (button.pressed) {
                    if (
                        !this.digital.PRESSED.has(name) &&
                        !this.digital.JUST_PRESSED.has(name)
                    ) {
                        this.digitalInputPressed(name);
                    }
                } else {
                    if (
                        this.digital.PRESSED.has(name) ||
                        this.digital.JUST_PRESSED.has(name)
                    ) {
                        this.digitalInputReleased(name);
                    }
                }
            });

            this.setAnalog(
                `Gamepad${gamepad.index}-LeftStickX`,
                gamepad.axes[0]
            );
            this.setAnalog(
                `Gamepad${gamepad.index}-LeftStickY`,
                gamepad.axes[1]
            );
            this.setAnalog(
                `Gamepad${gamepad.index}-RightStickX`,
                gamepad.axes[2]
            );
            this.setAnalog(
                `Gamepad${gamepad.index}-RightStickY`,
                gamepad.axes[3]
            );
        });
    }

    protected findAlias(button: DigitalInput): DigitalInput {
        if (button.startsWith("DefaultGamepad")) {
            button = button.replace(
                "DefaultGamepad",
                `Gamepad${this.defaultGamepad ?? 0}`
            ) as DigitalInput;
            // console.log(button);
        }

        if (button.startsWith("Gamepad")) {
            const [GPnum, key] = button.split("-") as [
                `Gamepad${number}`,
                GamepadKey
            ];

            return `${GPnum}-${GAMEPAD_ALIASES.get(key as any) ?? key}`;
        }

        return INPUT_ALIASES.get(button) || button;
    }

    //#region API

    stateRaw(button: DigitalInput): ButtonState {
        for (const state of BUTTON_STATES) {
            if (this.digital[state].has(button)) return state;
        }

        return "RELEASED";
    }

    state(bindingName: string): ButtonState {
        const binding = this.digitalBindings.get(bindingName)!;
        if (!binding) return "RELEASED";
        for (const state of BUTTON_STATES) {
            if (binding.is(this, state)) return state;
        }
        return "RELEASED";
    }

    is(bindingName: string, state: ButtonState) {
        return this.digitalBindings.get(bindingName)?.is(this, state) ?? false;
    }

    isRaw(button: DigitalInput, state: ButtonState): boolean {
        button = this.findAlias(button);

        switch (state) {
            case "JUST_PRESSED":
            case "JUST_RELEASED":
                return this.digital[state].has(button);

            case "PRESSED":
                return (
                    this.digital.PRESSED.has(button) ||
                    this.digital.JUST_PRESSED.has(button)
                );

            case "RELEASED":
                // This one is kind of weird, because keys that don't exist / haven't been added count as released
                if (
                    this.digital.PRESSED.has(button) ||
                    this.digital.JUST_PRESSED.has(button)
                )
                    return false;
                return true;
        }
    }

    isGamepad(
        gamepad: number,
        button: GamepadKey | number,
        state: ButtonState
    ) {
        return this.isRaw(`Gamepad${gamepad}-${button}`, state);
    }

    isDefaultGamepad(button: GamepadKey | number, state: ButtonState) {
        return this.isGamepad(this.defaultGamepad!, button, state);
    }

    get(bindingName: string) {
        const analog = this.analogBindings.get(bindingName);
        if (analog) return analog.get(this);
        const digital = this.digitalBindings.get(bindingName);
        if (digital) return digital.is(this, "PRESSED") ? 1 : 0;
        return 0;
    }

    getRaw(input: AnalogInput | DigitalInput): number {
        if (input.startsWith("DefaultGamepad")) {
            input = input.replace(
                "DefaultGamepad",
                `Gamepad${this.defaultGamepad ?? 0}`
            ) as AnalogInput;
        }

        if (this.analog.has(input as AnalogInput))
            return this.analog.get(input as AnalogInput)!;

        return this.isRaw(input as DigitalInput, "PRESSED") ? 1 : 0;
    }

    getGamepad(gamepad: number, input: AnalogGamepad): number {
        return this.getRaw(`Gamepad${gamepad}-${input}`);
    }

    getDefaultGamepad(input: AnalogGamepad): number {
        return this.getGamepad(this.defaultGamepad!, input);
    }

    getAvailableGamepads() {
        return this.connectedGamepads.slice();
    }
    //#endregion

    bind(bindingName: string, binding: Binding) {
        if (binding instanceof DigitalBinding) {
            this.digitalBindings.set(bindingName, binding);
        } else {
            this.analogBindings.set(bindingName, binding);
        }
    }
}

export const InputPlugin = ResourceUpdaterPlugin(Input, true);

//#region Bindings

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

// It doesn't really extend I can just steal all the constructor code
export class AnyBinding extends AllBinding {
    is(inputInstance: Input, state: ButtonState): boolean {
        for (const input of this.inputs) {
            if (inputInstance.isRaw(input, state)) return true;
        }
        return false;
    }
}

export class CombinedBinding<T extends number> extends AnalogBinding {
    constructor(
        public inputs: (AnalogInput | DigitalInput)[] & { length: T },
        public weights: number[] & { length: T }
    ) {
        super();
    }

    get(input: Input) {
        let sum = 0;
        for (let i = 0; i < this.inputs.length; i++) {
            sum += input.getRaw(this.inputs[i]) * this.weights[i];
        }
        return sum;
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

export const Binding = {
    DIRECT: {
        ANALOG: DirectAnalogBinding,
        DIGITAL: DirectDigitalBinding,
    },
    ALL: AllBinding,
    ANY: AnyBinding,
    COMBINED: CombinedBinding,
    DEADZONE: DeadzoneBinding,
    GREATEST: GreatestAbsBinding,
    REMAPPED: RemappedBinding,
} as const;
//#endregion
