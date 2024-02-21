import {
    Entity,
    EntityManager,
    LOGGED_COMPONENT_STORAGE_BUFFER_SIZE,
    TypeIdBuilder,
    World,
} from "bagelecs";

// What are some reasons this isn't working?

export class MultiplayerEntityManager extends EntityManager {
    private readonly log: (Set<Entity> | null)[] = [];

    update() {
        if (this.log.unshift(null) > LOGGED_COMPONENT_STORAGE_BUFFER_SIZE) {
            this.log.pop();
        }
    }

    private saveInitialState() {
        if (this.log[0] === null) {
            this.log[0] = new Set(this.entities);
        } else {
        }
    }

    rollback(numFrames: number) {
        for (let i = numFrames; i >= 0; i--) {
            if (!this.log[i]) continue;
            //@ts-ignore
            this.entities = this.log[i];
            break;
        }
        this.log.splice(0, numFrames + 1);
    }

    spawn(...components: any): Entity {
        this.saveInitialState();
        return super.spawn(...components);
    }

    destroy(ent: Entity) {
        this.saveInitialState();
        // const from = this.world.archetypeManager.archetypes.get(
        //     this.world.archetypeManager.entityArchetypes[ent]
        // )!;

        // this.world.archetypeManager.moveWithoutGraph(
        //     ent,
        //     from,
        //     this.world.archetypeManager.defaultArchetype
        // );
        super.destroy(ent);
    }
}

export function patchWorldMethods(world: World) {
    //@ts-expect-error
    world.entityManager = new MultiplayerEntityManager(world);
}
