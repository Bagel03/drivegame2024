import { enableInspect, monitor } from "../../editor/inspect";
import { State, StateClass } from "../../engine/state_managment";
import { RemoveDeadEntities } from "../systems/timed";
import { enablePixiRendering } from "../../engine/rendering/plugin";
import { MovementSystem } from "../systems/movement";
import { CollisionSystem } from "../systems/collision";
import { startMultiplayerInput } from "../../engine/multiplayer/multiplayer_input";

export class Game extends State<never> {
    async onEnter<From extends StateClass<any>>(
        payload: never,
        from: From
    ): Promise<void> {
        enablePixiRendering(this.world);
        startMultiplayerInput(this.world);
        enableInspect(this.world);

        this.world.addSystem(MovementSystem);
        this.world.addSystem(MovementSystem, "rollback");

        this.world.addSystem(RemoveDeadEntities);
        this.world.addSystem(RemoveDeadEntities, "rollback");

        this.world.addSystem(CollisionSystem);
        this.world.addSystem(CollisionSystem, "rollback");
    }

    update() {}
    async onLeave() {}
}
