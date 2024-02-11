// import { GraphicsEnt } from "../../engine/rendering/blueprints/graphics";
// import { ExtractPayload, State, StateClass } from "../../engine/state_managment";
// import { movementScript } from "../scripts/movement";
// import { NetworkConnection, PeerId } from "../../engine/multiplayer/network";
// import { Velocity } from "../components/velocity";
// import { RemoveDeadEntities } from "../systems/timed";
// import { enableInspect, monitor } from "../../editor/inspect";
// import { Position } from "../../engine/rendering/position";
// import { Input, InputMethod } from "../../engine/input/input";
// import { Joystick } from "../hud/components/joystick";
// import { resize } from "../../engine/rendering/resize";
// import { Application } from "pixi.js";

// import * as PIXI from "pixi.js";
// import { MovementSystem } from "../systems/movement";
// import { enablePixiRendering } from "../../engine/rendering/plugin";
// import {
//     MultiplayerInput,
//     startMultiplayerInput,
// } from "../../engine/multiplayer/multiplayer_input";
// import { System, Type } from "bagelecs";
// import { RollbackManager } from "../../engine/multiplayer/rollback";
// import { MrGriffinPlayer } from "../scripts/players/griffin";
// import { PlayerInfo } from "../components/player_info";
// import { CollisionSystem } from "../systems/collision";
// import { CollisionHitbox } from "../components/collision";
// import { Game } from "./game";

// window.pixi = PIXI;

// declare global {
//     interface Window {
//         inputLog: Record<number, string>;
//         pixi: typeof PIXI;
//     }
// }

// export class MultiplayerGame extends Game {
//     async onEnter<From extends StateClass<any>>(payload: never, from: From) {
//         super.onEnter(payload, from);

//         // resize(this.world.get(Application));

//         const networkConn = this.world.get(NetworkConnection);

//         const player1 = GraphicsEnt(
//             16 * 2,
//             16 * 2,
//             { fillStyle: "blue" },
//             "drawRect",
//             0,
//             0,
//             16,
//             16
//         );
//         player1.add(new PeerId(networkConn.player1));
//         player1.addScript(MrGriffinPlayer);
//         player1.add(new PlayerInfo({ canJump: false, heath: 3, ultPercent: 0 }));
//         player1.add(new Velocity({ x: 0, y: 0 }));
//         player1.add(new CollisionHitbox({ x: 16, y: 16 }));

//         const player2 = GraphicsEnt(
//             16 * 13,
//             16 * 2,
//             {
//                 fillStyle: "red",
//             },
//             "drawRect",
//             0,
//             0,
//             16,
//             16
//         );

//         player2.add(new PeerId(networkConn.player2));
//         player2.addScript(MrGriffinPlayer);

//         player2.add(new PlayerInfo({ canJump: false, heath: 3, ultPercent: 0 }));
//         player2.add(new Velocity({ x: 0, y: 0 }));
//         player2.add(new CollisionHitbox({ x: 16, y: 16 }));

//         if (networkConn.id === networkConn.player1)
//             this.world.add(player1, "local_player_entity");
//         else this.world.add(player2, "local_player_entity");

//         if (InputMethod.isMobile()) {
//             document.body.append(
//                 Joystick({ side: "left", id: "Movement" }),
//                 Joystick({ side: "right", id: "Shoot" })
//             );
//         }

//         // setTimeout(() => this.world.get(MultiplayerInput).beginSync(), 100);
//         window.inputLog = this.inputLog;

//         const nc = networkConn;
//         const rb = this.world.get(RollbackManager);
//         const ip = this.world.get(MultiplayerInput);
//         const inputLogger = class extends System({}) {
//             update() {
//                 window.inputLog[nc.framesConnected - rb.currentFramesBack] =
//                     // console.log(
//                     // rb.currentlyInRollback,
//                     // "Frame: ",
//                     // nc.framesConnected - rb.currentFramesBack,
//                     // "x:",
//                     // player1.get(Position.x)
//                     // );
//                     ip.get("x", nc.player1) + " " + ip.get("x", nc.player2);
//                 //  player1.get(Position.x) + " " + player2.get(Position.x);
//             }
//         };

//         this.world.addSystem(inputLogger);
//         this.world.addSystem(inputLogger, "rollback");
//     }

//     public inputLog: Record<number, string> = {};
//     update(): void {}

//     async onLeave(): Promise<void> {
//         return;
//     }
// }

import { Graphics, Sprite, Texture } from "pixi.js";
import { NetworkConnection, PeerId } from "../../engine/multiplayer/network";
import { AnimatedSprite } from "../../engine/rendering/animation";
import { GraphicsEnt } from "../../engine/rendering/blueprints/graphics";
import { StateClass } from "../../engine/state_managment";
import { CollisionHitbox } from "../components/collision";
import { PlayerInfo } from "../components/player_info";
import { Velocity } from "../components/velocity";
import { BombPlayer } from "../scripts/players/bombs";
import { MrCarrierPlayer } from "../scripts/players/carrier";
import { MrGriffinPlayer } from "../scripts/players/griffin";
import { LaserPlayer } from "../scripts/players/laser";
import { Game } from "./game";
import { Wall } from "../blueprints/wall";
import { Joystick } from "../hud/components/joystick";
import { Input } from "../../engine/input/input";
import { MultiplayerInput } from "../../engine/multiplayer/multiplayer_input";
import "./preload";
import { RollbackManager } from "../../engine/multiplayer/rollback";
import { MovementSystem } from "../systems/movement";
import { PlayerDescriptor, Players } from "../players";

export class MultiplayerGame extends Game {
    async onEnter<From extends StateClass<any>>(
        payload: never,
        from: From
    ): Promise<void> {
        await super.onEnter(payload, from);
        // this.world.disable(MovementSystem);

        const player1 = GraphicsEnt(
            48,
            32,
            { fillStyle: "blue" },
            "drawRect",
            0,
            0,
            16,
            16
        );
        const player2 = GraphicsEnt(
            256 - 48 - 16,
            32,
            { fillStyle: "red" },
            "drawRect",
            0,
            0,
            16,
            16
        );

        for (const player of [player1, player2]) {
            player.remove(Graphics);
            console.log(player.has(Graphics), player.has(Sprite));
            player.add(new Sprite(Texture.from("walk_00.png")));
            player.get(Sprite).width = 40;
            player.get(Sprite).height = 32;
            player.add(new Velocity({ x: 0, y: 0 }));
            // player.addScript(LaserPlayer);
            player.add(
                new PlayerInfo({
                    canJump: true,
                    heath: 100,
                    shootCooldown: 0,
                    ultPercent: 0,
                    ultTimeLeft: 0,
                })
            );
            player.add(new CollisionHitbox({ x: 32, y: 32 }));
            player.add(
                new AnimatedSprite({
                    spriteName: "walk",
                    currentFrame: 0,
                    thisFrameElapsed: 0,
                    thisFrameTotal: 15,
                    frameCount: 8,
                })
            );
        }

        player1.add(new PeerId(this.world.get(NetworkConnection).player1));
        player2.add(new PeerId(this.world.get(NetworkConnection).player2));

        if (
            this.world.get(NetworkConnection).id ===
            this.world.get(NetworkConnection).player1
        ) {
            player1.addScript(
                Players[this.world.get<"carrier">("localPlayer")].playerScript
            );
            player2.addScript(
                Players[this.world.get<"carrier">("remotePlayer")].playerScript
            );
            this.world.add(player1, "local_player_entity");
            this.world.add(player2, "remote_player_entity");
        } else {
            player1.addScript(
                Players[this.world.get<"carrier">("remotePlayer")].playerScript
            );
            player2.addScript(
                Players[this.world.get<"carrier">("localPlayer")].playerScript
            );
            this.world.add(player1, "remote_player_entity");
            this.world.add(player2, "local_player_entity");
        }

        // player1.remove(Graphics);
        // player1.add(new Sprite(Texture.from("walk_00.png")));
        // player1.get(Sprite).width = 40;
        // player1.get(Sprite).height = 32;
        // player1.addScript(MrCarrierPlayer);
        // player1.add(new Velocity({ x: 0, y: 0 }));
        // player1.add(
        //     new PlayerInfo({
        //         canJump: true,
        //         heath: 100,
        //         shootCooldown: 0,
        //         ultPercent: 0,
        //         ultTimeLeft: 0,
        //     })
        // );
        // player1.add(new CollisionHitbox({ x: 32, y: 32 }));
        // // Look into removing this
        // player1.add(new PeerId(this.world.get(NetworkConnection).id));
        // player1.add(
        //     new AnimatedSprite({
        //         spriteName: "walk",
        //         currentFrame: 0,
        //         thisFrameElapsed: 0, // Note that both of these are in frames, not ms or seconds
        //         thisFrameTotal: 15,
        //         frameCount: 8,
        //     })
        // );

        // this.world.add(player1, "local_player_entity");

        Wall(0, 230, 256, 20, "red");
        Wall(50, 170, 50, 10, "red");
        Wall(256 - 50 - 50, 170, 50, 10, "red");

        const joysticks = (
            <>
                <Joystick id="Movement" side="left"></Joystick>
                <Joystick id="Shoot" side="right"></Joystick>
            </>
        ) as any as HTMLElement[];
        document.body.append(...joysticks);

        // Wait 3 seconds before starting the input sync
        setTimeout(() => {
            this.world.get(RollbackManager).enableRollback();
            // this.world.enable(MovementSystem);
        }, 3000);
    }

    update(): void {}
}
