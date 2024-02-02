import {
    Class,
    LOGGED_COMPONENT_STORAGE_BUFFER_SIZE,
    Logger,
    intoID,
} from "bagelecs";
import { BagelSystem } from "bagelecs";
import { StorageKind } from "bagelecs";
import { World } from "bagelecs";
import { Entity } from "bagelecs";
import { LoggedArchetypeManager } from "./archetype";
import { NetworkConnection } from "./network";
import { patchWorldMethods } from "./entities";

export class RollbackManager {
    public currentlyInRollback: boolean = false;
    public currentFramesBack = 0;

    public readonly logger = new Logger("Rollback");

    constructor(public readonly world: World) {
        world.createSchedule("rollback");
    }

    startRollback(numFramesAgo: number) {
        this.currentlyInRollback = true;
        this.currentFramesBack = numFramesAgo;

        if (numFramesAgo > this.world.get(NetworkConnection).framesConnected) {
            this.logger.warn(
                "Tried to rollback",
                numFramesAgo,
                "frames, while we have only been connected ",
                this.world.get(NetworkConnection).framesConnected,
                "frames",
                "Will only roll back that many frames, so desync could occur "
            );
            numFramesAgo = this.world.get(NetworkConnection).framesConnected;
        }

        if (numFramesAgo > LOGGED_COMPONENT_STORAGE_BUFFER_SIZE) {
            this.logger.warn(
                "Tried to rollback",
                numFramesAgo,
                "frames, while the max buffer size is",
                LOGGED_COMPONENT_STORAGE_BUFFER_SIZE,
                "Will only roll back that many frames, so desync could occur "
            );
            numFramesAgo = LOGGED_COMPONENT_STORAGE_BUFFER_SIZE;
        }

        this.logger.log(
            "Rolling back",
            numFramesAgo,
            "frames to frame",
            this.world.get(NetworkConnection).framesConnected - numFramesAgo
        );

        const storages = this.world.storageManager.getAllByType(StorageKind.logged);
        storages.forEach((storage) => storage.rollback(numFramesAgo));
        this.world.archetypeManager.rollback(numFramesAgo);
        this.world.entityManager.rollback(numFramesAgo);

        // What are some issues here?

        while (this.currentFramesBack >= 0) {
            // this.world.tick("rollback");
            this.world.storageManager.update();
            this.world.archetypeManager.update();
            this.world.entityManager.update();
            this.world.update("rollback");

            this.currentFramesBack--;
        }

        this.currentFramesBack = 0;

        this.currentlyInRollback = false;
    }

    update() {}
}

export function rollbackPlugin(world: World) {
    //@ts-ignore
    world.archetypeManager = new LoggedArchetypeManager(world);
    patchWorldMethods(world);
    world.add(new RollbackManager(world));
}
