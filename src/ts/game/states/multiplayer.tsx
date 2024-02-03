import { GraphicsEnt } from "../../engine/rendering/blueprints/graphics";
import { ExtractPayload, State, StateClass } from "../../engine/state_managment";
import { movementScript } from "../scripts/movement";
import { NetworkConnection, PeerId } from "../../engine/multiplayer/network";
import { Velocity } from "../components/velocity";
import { RemoveDeadEntities } from "../systems/timed";
import { enableInspect, monitor } from "../../editor/inspect";
import { Position } from "../../engine/rendering/position";
import { Input, InputMethod } from "../../engine/input/input";
import { Joystick } from "../hud/components/joystick";
import { resize } from "../../engine/rendering/resize";
import { Application } from "pixi.js";

import * as PIXI from "pixi.js";
import { MovementSystem } from "../systems/movement";
import { enablePixiRendering } from "../../engine/rendering/plugin";
import {
    MultiplayerInput,
    startMultiplayerInput,
} from "../../engine/multiplayer/multiplayer_input";
import { System, Type } from "bagelecs";
import { RollbackManager } from "../../engine/multiplayer/rollback";
import { MrGriffinPlayer } from "../scripts/players/griffin";
import { PlayerInfo } from "../components/player_info";
import { CollisionSystem } from "../systems/collision";
import { CollisionHitbox } from "../components/collision";
import { Game } from "./game";

window.pixi = PIXI;

declare global {
    interface Window {
        inputLog: Record<number, string>;
        pixi: typeof PIXI;
    }
}

export class MultiplayerGame extends Game {
    async onEnter<From extends StateClass<any>>(payload: never, from: From) {
        super.onEnter(payload, from);

        // resize(this.world.get(Application));

        const networkConn = this.world.get(NetworkConnection);

        const player1 = GraphicsEnt(
            16 * 2,
            16 * 2,
            { fillStyle: "blue" },
            "drawRect",
            0,
            0,
            16,
            16
        );
        player1.add(new PeerId(networkConn.player1));
        player1.addScript(MrGriffinPlayer);
        player1.add(new PlayerInfo({ canJump: false, heath: 3, ultPercent: 0 }));
        player1.add(new Velocity({ x: 0, y: 0 }));
        player1.add(new CollisionHitbox({ x: 16, y: 16 }));

        const player2 = GraphicsEnt(
            16 * 13,
            16 * 2,
            {
                fillStyle: "red",
            },
            "drawRect",
            0,
            0,
            16,
            16
        );

        player2.add(new PeerId(networkConn.player2));
        player2.addScript(MrGriffinPlayer);

        player2.add(new PlayerInfo({ canJump: false, heath: 3, ultPercent: 0 }));
        player2.add(new Velocity({ x: 0, y: 0 }));
        player2.add(new CollisionHitbox({ x: 16, y: 16 }));

        if (networkConn.id === networkConn.player1)
            this.world.add(player1, "local_player");
        else this.world.add(player2, "local_player");

        if (InputMethod.isMobile()) {
            document.body.append(
                Joystick({ side: "left", id: "Movement" }),
                Joystick({ side: "right", id: "Shoot" })
            );
        }

        // setTimeout(() => this.world.get(MultiplayerInput).beginSync(), 100);
        window.inputLog = this.inputLog;

        const nc = networkConn;
        const rb = this.world.get(RollbackManager);
        const ip = this.world.get(MultiplayerInput);
        const inputLogger = class extends System({}) {
            update() {
                window.inputLog[nc.framesConnected - rb.currentFramesBack] =
                    // console.log(
                    // rb.currentlyInRollback,
                    // "Frame: ",
                    // nc.framesConnected - rb.currentFramesBack,
                    // "x:",
                    // player1.get(Position.x)
                    // );
                    ip.get("x", nc.player1) + " " + ip.get("x", nc.player2);
                //  player1.get(Position.x) + " " + player2.get(Position.x);
            }
        };

        this.world.addSystem(inputLogger);
        this.world.addSystem(inputLogger, "rollback");
    }

    public inputLog: Record<number, string> = {};
    update(): void {}

    async onLeave(): Promise<void> {
        return;
    }
}
