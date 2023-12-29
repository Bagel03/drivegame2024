import { Class, intoID } from "bagelecs";
import { BagelSystem } from "bagelecs";
import { StorageKind } from "bagelecs";
import { World } from "bagelecs";
import { Entity } from "bagelecs";
import { LoggedArchetypeManager } from "./archetype";
import { patchWorldMethods } from "./world";

export class RollbackManager {
    public currentlyInRollback: boolean = false;
    public currentFramesBack = 0;

    constructor(public readonly world: World) {
        world.createSchedule("rollback");
    }

    startRollback(numFramesAgo: number) {
        this.currentlyInRollback = true;
        this.currentFramesBack = numFramesAgo;

        const storages = this.world.storageManager.getAllByType(StorageKind.logged);
        storages.forEach((storage) => storage.rollback(numFramesAgo));
        this.world.archetypeManager.rollback(numFramesAgo);
        this.world.entityManager.rollback(numFramesAgo);

        while (this.currentFramesBack >= 0) {
            this.world.storageManager.update();
            this.world.archetypeManager.update();
            this.world.entityManager.update();
            this.world.update("rollback");

            this.currentFramesBack--;
        }

        this.currentFramesBack = 0;

        this.currentlyInRollback = false;
    }

    // APIS for resources and entities
    private watchedResources: number[] = [];
    private resourceLogs: any[][] = [];

    registerRollbackResource(id: intoID) {
        if (typeof id !== "number") id = id.getId();

        this.watchedResources.push(id);
        this.resourceLogs.push([]);
    }

    private justAddedEntities: Entity[][] = [];
    private justRemovedEntities: Entity[][] = [];

    registerNewEntity(entity: Entity) {
        if (this.justAddedEntities[0] === null) {
            this.justAddedEntities[0] = [entity];
        } else this.justAddedEntities[0].push(entity);
    }

    registerRemovedEntity(entity: Entity) {
        if (this.justRemovedEntities[0] === null) {
            this.justRemovedEntities[0] = [entity];
        } else this.justRemovedEntities[0].push(entity);
    }

    update() {}
}

export function rollbackPlugin(world: World) {
    //@ts-ignore
    world.archetypeManager = new LoggedArchetypeManager(world);
    patchWorldMethods(world);
    world.add(new RollbackManager(world));
}
