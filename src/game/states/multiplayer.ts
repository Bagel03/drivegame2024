import { GraphicsEnt } from "../../engine/rendering/blueprints/graphics";
import { ExtractPayload, State, StateClass } from "../../engine/state_managment";
import { PlayerInfo, movementScript } from "../scripts/movement";
import { NetworkConnection, PeerId } from "../../engine/multiplayer/network";
import { Velocity } from "../components/velocity";
import { RemoveDeadEntities } from "../systems/timed";

export class MultiplayerGameState extends State<never> {
    async onEnter<From extends StateClass<any>>(payload: never, from: From) {
        this.world.addSystem(RemoveDeadEntities);
        this.world.addSystem(RemoveDeadEntities, "rollback");

        const localPlayer = GraphicsEnt(
            50,
            50,
            { fillStyle: "blue" },
            "drawRect",
            0,
            0,
            50,
            50
        );
        localPlayer.add(new PeerId(this.world.get(NetworkConnection).id));
        localPlayer.addScript(movementScript);
        localPlayer.add(new PlayerInfo({ shootTimer: 0, dashTimer: 0 }));
        localPlayer.add(new Velocity({ x: 0, y: 0 }));

        const remotePlayer = GraphicsEnt(
            50,
            50,
            {
                fillStyle: "red",
            },
            "drawRect",
            0,
            0,
            50,
            50
        );

        remotePlayer.add(new PeerId(this.world.get(NetworkConnection).remoteIds[0]));
        remotePlayer.addScript(movementScript);

        remotePlayer.add(new PlayerInfo({ shootTimer: 0, dashTimer: 0 }));
        remotePlayer.add(new Velocity({ x: 0, y: 0 }));
    }

    update(): void {}

    async onLeave<Into extends StateClass<any>>(to: Into): Promise<void> {
        return;
    }
}
