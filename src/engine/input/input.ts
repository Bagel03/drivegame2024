import { System, World } from "bagelecs";
import { ResourceUpdaterPlugin } from "../resource";
import { JoystickConnectedEvent } from "../../game/hud/components/joystick";
import { AnalogBinding, Binding, DigitalBinding } from "./input_bindings";
import {
    AnalogGamepad,
    AnalogInput,
    DigitalInput,
    GAMEPAD_ALIASES,
    GamepadKey,
    INPUT_ALIASES,
} from "./input_types";
import EventEmitter from "events";

export type ButtonState = "PRESSED" | "RELEASED" | "JUST_PRESSED" | "JUST_RELEASED";

export const BUTTON_STATES: ButtonState[] = [
    "JUST_PRESSED",
    "JUST_RELEASED",
    "PRESSED",
    "RELEASED",
];

/** Extend this to add bindings */
export interface Bindings {}

export type AnalogBindingKey = keyof Bindings;

export type DigitalBindingKey = keyof {
    [key in keyof Bindings as Bindings[key] extends DigitalBinding ? key : never]: 0;
};

/** A list of input methods and functions that detect when to change between them */
export type InputMethodName = "KBM" | "MOBILE" | "GAMEPAD";

export class InputMethod {
    private constructor(
        public readonly name: InputMethodName,
        public readonly init: (input: Input) => void,
        public readonly isAvailable: (input: Input) => boolean
    ) {}

    static readonly isMobile = () =>
        /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    static readonly KMB = new InputMethod(
        "KBM",
        (input: Input) => {
            if (InputMethod.isMobile()) return;

            window.addEventListener("keydown", (e) =>
                input.requestInputMethodChange("KBM")
            );

            // Don't instantly request this, because gamepad might be connected and this is inited by default
        },
        () => !InputMethod.isMobile()
    );

    static readonly mobile = new InputMethod(
        "MOBILE",
        (input: Input) => {
            if (InputMethod.isMobile()) input.requestInputMethodChange("MOBILE");
        },
        () => InputMethod.isMobile()
    );

    static readonly gamepad = new InputMethod(
        "GAMEPAD",
        (input: Input) => {
            if (input.connectedGamepads.length > 0)
                input.requestInputMethodChange("GAMEPAD");
        },
        (input: Input) => input.connectedGamepads.length > 0
    );

    static readonly methods = [this.KMB, this.mobile, this.gamepad] as const;

    static getMethod(name: InputMethodName) {
        return this.methods.find((n) => n.name == name)!;
    }
}

export type GamepadButtonEvent = CustomEvent<{
    gamepad: Gamepad;
    button: number;
    state: "PRESSED" | "RELEASED";
}>;
// export type GamepadAxisChange = CustomEvent<{gamepad: Gamepad, button: GamepadButton, state: "PRESSED" | "RELEASED"}>

declare global {
    interface WindowEventHandlersEventMap {
        gamepadbuttonpressed: GamepadButtonEvent;
    }
}

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

    public connectedGamepads: number[] = [];
    public defaultGamepad: number | null = null;

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
        /* KEY STUFF */
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

        /* MOUSE STUFF */
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

        /* GAMEPAD STUFF */
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

        /* JOYSTICK STUFF */
        window.addEventListener("joystickconnected", (e) => {
            e.detail.joystick.addEventListener(
                "inputchange",
                ({ detail: { x, y, angle } }) => {
                    this.setAnalog(`Joystick${e.detail.joystickId}-X`, x);
                    this.setAnalog(`Joystick${e.detail.joystickId}-Y`, y);
                    this.setAnalog(`Joystick${e.detail.joystickId}-Angle`, angle);
                }
            );
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
        this.digital.queue.PRESSED.forEach((b) => this.digital.JUST_PRESSED.add(b));
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
                        window.dispatchEvent(
                            new CustomEvent("gamepadbuttonpressed", {
                                detail: {
                                    gamepad,
                                    button: buttonIdx,
                                    state: "PRESSED",
                                },
                            }) satisfies GamepadButtonEvent
                        );
                    }
                } else {
                    if (
                        this.digital.PRESSED.has(name) ||
                        this.digital.JUST_PRESSED.has(name)
                    ) {
                        this.digitalInputReleased(name);
                        window.dispatchEvent(
                            new CustomEvent("gamepadbuttonpressed", {
                                detail: {
                                    gamepad,
                                    button: buttonIdx,
                                    state: "RELEASED",
                                },
                            }) satisfies GamepadButtonEvent
                        );
                    }
                }
            });

            this.setAnalog(`Gamepad${gamepad.index}-LeftStickX`, gamepad.axes[0]);
            this.setAnalog(`Gamepad${gamepad.index}-LeftStickY`, gamepad.axes[1]);
            this.setAnalog(`Gamepad${gamepad.index}-RightStickX`, gamepad.axes[2]);
            this.setAnalog(`Gamepad${gamepad.index}-RightStickY`, gamepad.axes[3]);
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

            return `${GPnum}-${GAMEPAD_ALIASES.get(key) ?? key}`;
        }

        return INPUT_ALIASES.get(button) || button;
    }

    protected inputMethods: Record<InputMethodName, Bindings> = {} as any;
    protected currentInputMethod!: InputMethodName;
    addInputMethod(method: InputMethodName, bindings: Bindings) {
        this.inputMethods[method] = bindings;

        if (
            InputMethod.getMethod(method).isAvailable(this) &&
            !this.currentInputMethod
        ) {
            this.currentInputMethod = method;
            this.requestInputMethodChange(method);
        }
    }

    requestInputMethodChange(method: InputMethodName) {
        this.currentInputMethod = method;

        Object.entries(this.inputMethods[method]).forEach(([name, binding]) =>
            this.bind(name, binding)
        );
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

    isGamepad(gamepad: number, button: GamepadKey | number, state: ButtonState) {
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
