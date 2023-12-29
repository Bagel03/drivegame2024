import { System, With, World } from "bagelecs";
import {
    AnalogBinding,
    AnyBinding,
    CombinedBinding,
    DeadzoneBinding,
    DigitalBinding,
    DirectAnalogBinding,
    Input,
} from "../engine/input";
import { Entity } from "bagelecs";
import { MultiplayerInput } from "../engine/multiplayer/multiplayer_input";
import { Component } from "bagelecs";
import { Type } from "bagelecs";
import { RollbackManager, rollbackPlugin } from "../engine/multiplayer/rollback";
import { MovementSystem } from "./systems/movement";
import { AimAngleBinding, FavorBinding } from "engine/input_bindings";
import { Position } from "engine/rendering/position";
import { Graphics, Point } from "pixi.js";

declare module "../engine/multiplayer/multiplayer_input" {
    export interface Bindings {
        x: AnalogBinding;
        y: AnalogBinding;
        dash: DigitalBinding;
        shoot: DigitalBinding;
        aimx: AnalogBinding;
        aimy: AnalogBinding;
        aimAngle: AnalogBinding;
    }
}

export async function MovementPlugin(world: World) {
    // world.add(new MultiplayerInput(world));
    const input = world.get(MultiplayerInput);

    input.bind(
        "x",
        new CombinedBinding(["KeyA", "KeyD"], [-1, 1])
        // new DeadzoneBinding(
        //     "DefaultGamepad-LeftStickX",
        //     [-1, -0.5, -1],
        //     [-0.5, 0.5, 0],
        //     [0.5, 1, 1]
        // )
    );
    input.bind(
        "y",
        new CombinedBinding(["KeyW", "KeyS"], [-1, 1])
        // new DeadzoneBinding(
        //     "DefaultGamepad-LeftStickY",
        //     [-1, -0.9, -1],
        //     [-0.1, 0.1, 0],
        //     [0.9, 1, 1]
        // )
    );
    input.bind(
        "dash",
        new AnyBinding(
            "Space",
            "DefaultGamepad-A",
            "ArrowUp",
            "DefaultGamepad-LeftStick"
        )
    );

    input.bind(
        "shoot",
        new AnyBinding("MouseLeft", "DefaultGamepad-B", "DefaultGamepad-R1")
    );

    input.bind(
        "aimAngle",
        new AimAngleBinding({
            originX: () => {
                try {
                    return world
                        .get<Entity>("local_player")
                        .get(Graphics)
                        .toGlobal(new Point(0, 0)).x;
                } catch (e) {
                    return 0;
                }
            },
            originY: () => {
                try {
                    return world
                        .get<Entity>("local_player")
                        .get(Graphics)
                        .toGlobal(new Point(0, 0)).y;
                } catch (e) {
                    return 0;
                }
            },
            targetX: (i) => i.getRaw("MouseX"),
            targetY: (i) => i.getRaw("MouseY"),
        })
    );

    input.bind(
        "aimx",
        new CombinedBinding(["ArrowLeft", "ArrowRight"], [-1, 1])
        // new DeadzoneBinding(
        //     "DefaultGamepad-RightStickX",
        //     [-1, -0.5, -1],
        //     [-0.5, 0.5, 0],
        //     [0.5, 1, 1]
        // )
    );
    input.bind(
        "aimy",
        new CombinedBinding(["ArrowUp", "ArrowDown"], [-1, 1])
        // new DeadzoneBinding(
        //     "DefaultGamepad-RightStickY",
        //     [-1, -0.9, -1],
        //     [-0.1, 0.1, 0],
        //     [0.9, 1, 1]
        // )
    );
    // input.syncBinding("x");
    // input.syncBinding("y");
    // input.syncBinding("jump");
    // input.syncBinding("shoot");

    world.addSystem(MovementSystem);
    // world.get(RollbackManager).registerRollbackSystem(InputSystem);

    world.addToSchedule(MovementSystem, "rollback");
    // world.get(RollbackManager).registerRollbackSystem(MovementSystem);
    // console.log("Peer ID:", world.get());
}
