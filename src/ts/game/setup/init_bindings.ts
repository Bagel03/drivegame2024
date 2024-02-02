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
import { MultiplayerGame } from "../states/multiplayer";
import { Container, Point } from "pixi.js";
import { Game } from "../states/game";

declare module "../../engine/input/input" {
    interface Bindings {
        x: AnalogBinding;
        y: AnalogBinding;
        aim: AnalogBinding;
        shoot: DigitalBinding;
        ult: DigitalBinding;
    }
}

const zero = new Point(0, 0);

export function initializeBindings(world: World) {
    const input = world.get(Input);

    input.addInputMethod("KBM", {
        x: new CombinedBinding({ KeyA: -1, KeyD: 1 }),
        y: new CombinedBinding({ KeyW: -1, KeyS: 1 }),
        // aim: new AdvancedAngleBinding({
        //     originX: () => 0,
        //     // world.get(StateManager).currentState === MultiplayerGameState
        //     //     ? world.get<Entity>("local_player").get(Container).toGlobal(zero)
        //     //           .x
        //     //     : 0,
        //     originY: () => 0,
        //     // world.get(StateManager).currentState === MultiplayerGameState
        //     //     ? world.get<Entity>("local_player").get(Container).toGlobal(zero)
        //     //           .y
        //     //     : 0,
        //     targetX: () => 1, // "MouseX",
        //     targetY: () => 1, //"MouseY",
        // }),
        aim: new AdvancedAngleBinding({
            originX: () => {
                let res =
                    world.get(StateManager).currentStateInstance instanceof Game
                        ? world
                              .get<Entity>("local_player")
                              .get(Container)
                              .toGlobal(zero).x
                        : 0;
                return res;
            },
            originY: () => {
                let res =
                    world.get(StateManager).currentStateInstance instanceof Game
                        ? world
                              .get<Entity>("local_player")
                              .get(Container)
                              .toGlobal(zero).y
                        : 0;

                return res;
            },
            targetX: "MouseX",
            targetY: "MouseY",
        }),
        shoot: new AnyBinding("MouseLeft"),
        ult: new AnyBinding("KeyE", "KeyF"),
    });

    input.addInputMethod("GAMEPAD", {
        x: new DirectAnalogBinding("DefaultGamepad-LeftStickX"),
        y: new DirectAnalogBinding("DefaultGamepad-LeftStickY"),
        aim: new AngleBinding(
            "DefaultGamepad-RightStickX",
            "DefaultGamepad-RightStickY"
        ),
        shoot: new DirectDigitalBinding("DefaultGamepad-A"),
        ult: new DirectDigitalBinding("DefaultGamepad-B"),
    });

    input.addInputMethod("MOBILE", {
        x: new DirectAnalogBinding("JoystickMovement-X"),
        y: new DirectAnalogBinding("JoystickMovement-Y"),
        aim: new DirectAnalogBinding("JoystickShoot-FireAngle"),
        shoot: new DirectDigitalBinding("JoystickShoot-Fire"),
        ult: new DirectDigitalBinding("JoystickShoot-Fire"),
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
