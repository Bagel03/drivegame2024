export type Key =
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

export type MouseButton =
    | `Mouse${number}`
    | `MouseLeft`
    | `MouseMiddle`
    | `MouseRight`;

export type GamepadKey =
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

export type GamepadButton =
    | `Gamepad${number}-${number}`
    | `Gamepad${number}-${GamepadKey}`
    | `DefaultGamepad-${number}`
    | `DefaultGamepad-${GamepadKey}`;

export type JoystickFire = `Joystick${string}-Fire`;
export type DigitalInput = Key | MouseButton | GamepadButton | JoystickFire;

// Analog

export type AnalogMouse =
    | "MouseX"
    | "MouseY"
    | "MouseXDelta"
    | "MouseYDelta"
    | "MouseScrollDelta";
export type AnalogGamepad =
    | "LeftStickX"
    | "LeftStickY"
    | "RightStickX"
    | "RightStickY";
export type AnalogJoystick = "X" | "Y" | "Angle" | "FireX" | "FireY" | "FireAngle";

// Gamepad buttons are both analog and digital
export type AnalogInput =
    | AnalogMouse
    | GamepadButton
    | `Gamepad${number}-${AnalogGamepad}`
    | `DefaultGamepad-${AnalogGamepad}`
    | `Joystick${string}-${AnalogJoystick}`;

export const INPUT_ALIASES = new Map<DigitalInput, DigitalInput>([
    ["MouseLeft", "Mouse0"],
    ["MouseRight", "Mouse2"],
    ["MouseMiddle", "Mouse1"],
]);

export const GAMEPAD_ALIASES = new Map<GamepadKey, number>([
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
