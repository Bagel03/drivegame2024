import { System, With } from "bagelecs";
import { Position } from "../../engine/rendering/position";
import { Friction, Velocity } from "../components/velocity";
import { NetworkConnection } from "../../engine/multiplayer/network";
import { RollbackManager } from "../../engine/multiplayer/rollback";
import { MultiplayerInput } from "../../engine/multiplayer/multiplayer_input";

export class MovementSystem extends System({
    all: With(Position, Velocity),
    friction: With(Position, Velocity, Friction),
}) {
    update(): void {
        // if (nc.remoteIds.length) {
        //     // console.log(
        //     //     "Running movement, frame",
        //     //     nc.timeConnectedTo[nc.remoteIds[0]]
        //     // );
        // }
        this.entities.friction.forEach((entity) => {
            entity.mult(Velocity.x, 1 - entity.get(Friction));
        });

        this.entities.all.forEach((entity) => {
            // console.log(entity);
            entity.inc(Position.x, entity.get(Velocity.x));
            entity.inc(Position.y, entity.get(Velocity.y));
        });

        // const nc = this.world.get(NetworkConnection);
        // const rb = this.world.get(RollbackManager);
        // const input = this.world.get(MultiplayerInput);
        // if (nc.isConnected) {
        //     // console.log(
        //     //     "Frame",
        //     //     nc.framesConnected - rb.currentFramesBack,
        //     //     rb.currentlyInRollback ? "(rollback)" : "",
        //     //     xPos,
        //     //     input.get("x"),
        //     //     input.get("x", nc.remoteId)
        //     // );
        // }
    }
}
