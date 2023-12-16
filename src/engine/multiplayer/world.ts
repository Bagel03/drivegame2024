import { Entity, World } from "bagelecs";

export class MultiplayerEntityManager {
    public readonly entities = new Set<Entity>();

    constructor(public readonly world: World) {}

    spawn(): Entity {
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
    const $oldSpawn = world.spawn;
    const $oldDestroy = world.destroy;
    world.entityManager = new MultiplayerEntityManager(world);

    world.spawn = function () {
        return this.entityManager.spawn();
    };

    world.destroy = function (ent) {
        return this.entityManager.destroy(ent);
    };
}
