import { Entity, World } from "bagelecs";
import { Input } from "../../engine/input/input";
import {
    AdvancedAngleBinding,
    AnalogBinding,
    AngleBinding,
    AnyBinding,
    CombinedBinding,
    DigitalBinding,
    DirectAnalogBinding,
    DirectDigitalBinding,
} from "../../engine/input/input_bindings";
import { StateManager } from "../../engine/state_managment";
import { MultiplayerGameState } from "../states/multiplayer";
import { Container, Point } from "pixi.js";

declare module "../../engine/input/input" {
    interface Bindings {
        x: AnalogBinding;
        y: AnalogBinding;
        aim: AnalogBinding;
        shoot: DigitalBinding;
    }
}

const zero = new Point(0, 0);

export function initializeBindings(world: World) {
    const input = world.get(Input);

    input.addInputMethod("KBM", {
        x: new CombinedBinding({ KeyA: -1, KeyD: 1 }),
        y: new CombinedBinding({ KeyW: -1, KeyS: 1 }),
        aim: new AdvancedAngleBinding({
            originX: () => 0,
            // world.get(StateManager).currentState === MultiplayerGameState
            //     ? world.get<Entity>("local_player").get(Container).toGlobal(zero)
            //           .x
            //     : 0,
            originY: () => 0,
            // world.get(StateManager).currentState === MultiplayerGameState
            //     ? world.get<Entity>("local_player").get(Container).toGlobal(zero)
            //           .y
            //     : 0,
            targetX: () => 1, // "MouseX",
            targetY: () => 1, //"MouseY",
        }),
        // aim: new AdvancedAngleBinding({
        //     originX: () =>
        //         world.get(StateManager).currentState === MultiplayerGameState
        //             ? world.get<Entity>("local_player").get(Container).toGlobal(zero)
        //                   .x
        //             : 0,
        //     originY: () =>
        //         world.get(StateManager).currentState === MultiplayerGameState
        //             ? world.get<Entity>("local_player").get(Container).toGlobal(zero)
        //                   .y
        //             : 0,
        //     targetX: "MouseX",
        //     targetY: "MouseY",
        // }),
        shoot: new AnyBinding("MouseLeft", "Space"),
    });

    input.addInputMethod("GAMEPAD", {
        x: new DirectAnalogBinding("DefaultGamepad-LeftStickX"),
        y: new DirectAnalogBinding("DefaultGamepad-LeftStickY"),
        aim: new AngleBinding(
            "DefaultGamepad-RightStickX",
            "DefaultGamepad-RightStickY"
        ),
        shoot: new DirectDigitalBinding("DefaultGamepad-A"),
    });

    input.addInputMethod("MOBILE", {
        x: new DirectAnalogBinding("JoystickMovement-X"),
        y: new DirectAnalogBinding("JoystickMovement-Y"),
        aim: new DirectAnalogBinding("JoystickShoot-Angle"),
        shoot: new DirectDigitalBinding("JoystickShoot-Full"),
    });
}

/**
 * 
 *         aim: new AdvancedAngleBinding({
            originX: () => 0,
            // world.get(StateManager).currentState === MultiplayerGameState
            //     ? world.get<Entity>("local_player").get(Container).toGlobal(zero)
            //           .x
            //     : 0,
            originY: () => 0,
            // world.get(StateManager).currentState === MultiplayerGameState
            //     ? world.get<Entity>("local_player").get(Container).toGlobal(zero)
            //           .y
            //     : 0,
            targetX: () => 1, // "MouseX",
            targetY: () => 1, //"MouseY",
        }),
 */
