import { System, World } from "bagelecs";
import { NetworkConnection } from "./network";

export class CatchUpSystem extends System({}) {
    public readonly framesBetweenChecks = 60; // Every 2 seconds

    public readonly networkConnection;

    constructor(world: World) {
        super(world);
        this.networkConnection = world.get(NetworkConnection);
    }

    update(): void {
        const frame = this.networkConnection.framesConnected;
        if (frame % this.framesBetweenChecks === 0) {
            this.networkConnection.send("catch_up_check", {
                frame,
                time: Date.now() - this.networkConnection.connectionStartTime,
            });
        }
    }
}
