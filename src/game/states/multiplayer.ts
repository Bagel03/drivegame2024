import { GraphicsEnt } from "../../engine/rendering/blueprints/graphics";
import { ExtractPayload, State, StateClass } from "../../engine/state_managment";
import { PlayerInfo, movementScript } from "../scripts/movement";
import { NetworkConnection, PeerId } from "../../engine/multiplayer/network";
import { Velocity } from "../components/velocity";
import { RemoveDeadEntities } from "../systems/timed";
import { monitor } from "../../editor/inspect";
import { Position } from "engine/rendering/position";
import { loadLevel1Map } from "../levels/maps/1";

export class MultiplayerGameState extends State<never> {
    async onEnter<From extends StateClass<any>>(payload: never, from: From) {
        this.world.addSystem(RemoveDeadEntities);
        this.world.addSystem(RemoveDeadEntities, "rollback");

        loadLevel1Map(this.world);

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

        remotePlayer.add(new PeerId(this.world.get(NetworkConnection).remoteId));
        remotePlayer.addScript(movementScript);

        remotePlayer.add(new PlayerInfo({ shootTimer: 0, dashTimer: 0 }));
        remotePlayer.add(new Velocity({ x: 0, y: 0 }));

        monitor(localPlayer, Position.x, "Local X");
        monitor(remotePlayer, Position.x, "Remote X");
    }

    update(): void {}

    async onLeave<Into extends StateClass<any>>(to: Into): Promise<void> {
        return;
    }
}
