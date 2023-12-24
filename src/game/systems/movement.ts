import { System, With } from "bagelecs";
import { Position } from "../../engine/rendering/position";
import { Velocity } from "../components/velocity";
import { NetworkConnection } from "engine/multiplayer/network";

export class MovementSystem extends System(With(Position, Velocity)) {
    update(): void {
        // const nc = this.world.get(NetworkConnection);
        // if (nc.remoteIds.length) {
        //     // console.log(
        //     //     "Running movement, frame",
        //     //     nc.timeConnectedTo[nc.remoteIds[0]]
        //     // );
        // }
        this.entities.forEach((entity) => {
            // console.log(entity);
            entity.inc(Position.x, entity.get(Velocity.x));
            entity.inc(Position.y, entity.get(Velocity.y));
        });
    }
}
