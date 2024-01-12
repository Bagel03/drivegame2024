import { GraphicsEnt } from "../../engine/rendering/blueprints/graphics";
import { ExtractPayload, State, StateClass } from "../../engine/state_managment";
import { PlayerInfo, movementScript } from "../scripts/movement";
import { NetworkConnection, PeerId } from "../../engine/multiplayer/network";
import { Velocity } from "../components/velocity";
import { RemoveDeadEntities } from "../systems/timed";
import { enableInspect, monitor } from "../../editor/inspect";
import { Position } from "../../engine/rendering/position";
import { loadLevel1Map } from "../levels/maps/1";
import { Input, InputMethod } from "../../engine/input/input";
import { Joystick } from "../hud/components/joystick";
import { resize } from "../../engine/rendering/resize";
import { Application } from "pixi.js";

import * as PIXI from "pixi.js";
import { initializeBindings } from "../setup/init_bindings";
import { MovementSystem } from "../systems/movement";
import { enablePixiRendering } from "../../engine/rendering/plugin";
import {
    MultiplayerInput,
    startMultiplayerInput,
} from "../../engine/multiplayer/multiplayer_input";
import { System } from "bagelecs";
import { RollbackManager } from "../../engine/multiplayer/rollback";

window.pixi = PIXI;

declare global {
    interface Window {
        inputLog: Record<number, string>;
        pixi: typeof PIXI;
    }
}

export class MultiplayerGameState extends State<never> {
    async onEnter<From extends StateClass<any>>(payload: never, from: From) {
        enablePixiRendering(this.world);
        startMultiplayerInput(this.world);
        initializeBindings(this.world);
        enableInspect(this.world);

        this.world.addSystem(MovementSystem);
        this.world.addSystem(MovementSystem, "rollback");

        this.world.addSystem(RemoveDeadEntities);
        this.world.addSystem(RemoveDeadEntities, "rollback");

        console.log("here");
        await loadLevel1Map(this.world);
        resize(this.world.get(Application));

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
        player1.addScript(movementScript);
        player1.add(new PlayerInfo({ shootTimer: 0, dashTimer: 0 }));
        player1.add(new Velocity({ x: 0, y: 0 }));

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
        player2.addScript(movementScript);

        player2.add(new PlayerInfo({ shootTimer: 0, dashTimer: 0 }));
        player2.add(new Velocity({ x: 0, y: 0 }));

        if (networkConn.id === networkConn.player1)
            this.world.add(player1, "local_player");
        else this.world.add(player2, "local_player");

        monitor(player1, Position.x, "P1 X");
        monitor(player2, Position.x, "P2 X");

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

    async onLeave<Into extends StateClass<any>>(to: Into): Promise<void> {
        return;
    }
}
