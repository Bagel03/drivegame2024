import { GraphicsEnt } from "../../engine/rendering/blueprints/graphics";
import { ExtractPayload, State, StateClass } from "../../engine/state_managment";
import { PlayerInfo, movementScript } from "../scripts/movement";
import { NetworkConnection, PeerId } from "../../engine/multiplayer/network";
import { Velocity } from "../components/velocity";
import { RemoveDeadEntities } from "../systems/timed";
import { monitor } from "../../editor/inspect";
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
import { startMultiplayerInput } from "../../engine/multiplayer/multiplayer_input";
//@ts-expect-error
window.pixi = PIXI;

export class MultiplayerGameState extends State<never> {
    async onEnter<From extends StateClass<any>>(payload: never, from: From) {
        enablePixiRendering(this.world);
        startMultiplayerInput(this.world);
        initializeBindings(this.world);

        this.world.addSystem(MovementSystem);
        this.world.addSystem(MovementSystem, "rollback");

        this.world.addSystem(RemoveDeadEntities);
        this.world.addSystem(RemoveDeadEntities, "rollback");

        console.log("here");
        await loadLevel1Map(this.world);
        resize(this.world.get(Application));

        const localX =
            this.world.get(NetworkConnection).id === "A" ? 16 * 2 : 16 * 13;
        const remoteX =
            this.world.get(NetworkConnection).id === "A" ? 16 * 13 : 16 * 2;
        const localColor = localX === 16 * 2 ? "blue" : "red";
        const remoteColor = localX !== 16 * 2 ? "blue" : "red";

        const localPlayer = GraphicsEnt(
            localX,
            16 * 2,
            { fillStyle: localColor },
            "drawRect",
            0,
            0,
            16,
            16
        );
        localPlayer.add(new PeerId(this.world.get(NetworkConnection).id));
        localPlayer.addScript(movementScript);
        localPlayer.add(new PlayerInfo({ shootTimer: 0, dashTimer: 0 }));
        localPlayer.add(new Velocity({ x: 0, y: 0 }));
        this.world.add(localPlayer, "local_player");

        const remotePlayer = GraphicsEnt(
            remoteX,
            16 * 2,
            {
                fillStyle: remoteColor,
            },
            "drawRect",
            0,
            0,
            16,
            16
        );

        console.log(remotePlayer);

        remotePlayer.add(new PeerId(this.world.get(NetworkConnection).remoteId));
        remotePlayer.addScript(movementScript);

        remotePlayer.add(new PlayerInfo({ shootTimer: 0, dashTimer: 0 }));
        remotePlayer.add(new Velocity({ x: 0, y: 0 }));

        monitor(localPlayer, Position.x, "Local X");
        monitor(remotePlayer, Position.x, "Remote X");

        if (InputMethod.isMobile()) {
            document.body.append(
                Joystick({ side: "left", id: "Movement" }),
                Joystick({ side: "right", id: "Shoot" })
            );
        }

        // setTimeout(() => this.world.get(MultiplayerInput).beginSync(), 100);
    }

    update(): void {}

    async onLeave<Into extends StateClass<any>>(to: Into): Promise<void> {
        return;
    }
}
