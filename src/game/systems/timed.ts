import { System, With } from "bagelecs";
import { TimedAlive } from "../components/timed";

export class RemoveDeadEntities extends System(With(TimedAlive)) {
    update(): void {
        this.entities.forEach((ent) => {
            ent.inc(TimedAlive, -1);
            if (ent.get(TimedAlive) < 0) {
                this.world.destroy(ent);
            }
        });
    }
}
