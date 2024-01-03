import {
    Entity,
    LOGGED_COMPONENT_STORAGE_BUFFER_SIZE,
    TypeIdBuilder,
    World,
} from "bagelecs";

declare module "bagelecs" {
    interface EntityManager {
        rollback(numFrames: number): void;
    }
}
export class MultiplayerEntityManager {
    public readonly entities = new Set<Entity>();
    private static readonly bufferSize = LOGGED_COMPONENT_STORAGE_BUFFER_SIZE;
    private readonly log: (Set<Entity> | null)[] = [];

    constructor(public readonly world: World) {}

    update() {
        if (this.log.unshift(null) > MultiplayerEntityManager.bufferSize) {
            this.log.pop();
        }
    }

    private saveInitialState() {
        if (this.log[0] === null) {
            this.log[0] = new Set(this.entities);
        }
    }

    rollback(numFrames: number) {
        for (let i = numFrames; i >= 0; i--) {
            if (this.log[i] === null) continue;
            //@ts-ignore
            this.entities = this.log[i];
            break;
        }

        this.log.splice(0, numFrames + 1);
    }

    spawn(): Entity {
        this.saveInitialState();
        // There has to be faster ways to do this
        for (let i = 1; i <= this.entities.size + 1; i++) {
            if (!this.entities.has(i as Entity)) {
                const result = i as Entity;
                this.entities.add(result);
                this.world.archetypeManager.addEntity(result);
                return result;
            }
        }

        throw new Error("Shouldn't have gotten here");
    }

    destroy(ent: Entity) {
        this.saveInitialState();
        this.entities.delete(ent);
        this.world.archetypeManager.removeEntity(ent);
    }
}

declare module "bagelecs" {
    interface World {
        entityManager: MultiplayerEntityManager;
    }
}

export function patchWorldMethods(world: World) {
    const $oldSpawn = world.spawn.bind(world);
    const $oldDestroy = world.destroy.bind(world);
    const $oldTick = world.tick.bind(world);

    world.entityManager = new MultiplayerEntityManager(world);

    // world.spawn = function () {
    //     return this.entityManager.spawn();
    // };

    // world.destroy = function (ent) {
    //     return this.entityManager.destroy(ent);
    // };

    // world.tick = function (schedule) {
    //     this.entityManager.update();
    //     return $oldTick(schedule);
    // };
}
