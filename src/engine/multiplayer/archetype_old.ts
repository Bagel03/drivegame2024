import {
    Archetype,
    ArchetypeManager,
    Entity,
    LOGGED_COMPONENT_STORAGE_BUFFER_SIZE,
    Type,
    TypeIdBuilder,
    World,
} from "bagelecs";
import { NetworkConnection } from "./network";

export class LoggedArchetype extends Archetype {
    // private readonly bufferSize: number = TypeIdBuilder.defaultLoggedBufferSize;

    // Gonna be used a lot, positive numbers means they was added, negative means they was removed
    public readonly log: (Int32Array | null)[] = new Array(
        LOGGED_COMPONENT_STORAGE_BUFFER_SIZE
    ).fill(null);

    private logInitalStateIfNotSet() {
        if (this.log[0] === null) {
            this.log[0] = new Int32Array(this.entities);
            console.log(
                "Stored backup",
                this.log[0].toString(),
                "on frame",
                World.GLOBAL_WORLD.get(NetworkConnection).framesConnected
            );
        }
        //this.log[0] = [];
    }

    addEntity(entity: Entity): void {
        this.logInitalStateIfNotSet();
        // this.log[0]!.push(entity);
        super.addEntity(entity);
        console.log("Added entity to", this.id, `(${entity})`);
    }

    removeEntity(entity: Entity): void {
        this.logInitalStateIfNotSet();
        // this.log[0]?.push(-entity);
        super.removeEntity(entity);
        console.log("Removed entity to", this.id, `(${entity})`);
    }

    update() {
        if (this.log.unshift(null) > LOGGED_COMPONENT_STORAGE_BUFFER_SIZE) {
            this.log.pop();
        }
    }

    rollback(numFrames: number) {
        if (numFrames > LOGGED_COMPONENT_STORAGE_BUFFER_SIZE) {
            throw new Error("Out of bounds rollback");
        }

        for (let i = numFrames; i >= 0; i--) {
            if (this.log[i] === null) continue;

            this.entities.set(this.log[i]!);
            console.log(
                "Setting entities for",
                this.id,
                "to",
                this.entities.toString()
            );
            break;
            // // Remember, positive means the entity was added (ie. we need to remove it) + vice versa
            // for (const id of this.log[i]!) {
            //     if (id >= 0) {
            //         super.removeEntity(id as Entity);
            //     } else {
            //         super.addEntity(-id as Entity);
            //     }
            // }
            // this.log[i]!.set(this.entities);
        }

        this.log.splice(0, numFrames + 1);
    }
}

export class LoggedArchetypeManager {
    public readonly archetypes: Map<number, LoggedArchetype> = new Map();
    public readonly entityArchetypes: Int32Array;

    private readonly log: (Int32Array | null)[] = new Array(
        LOGGED_COMPONENT_STORAGE_BUFFER_SIZE
    );

    public readonly defaultArchetype: LoggedArchetype = new LoggedArchetype(
        0,
        new Set(),
        1
    );

    constructor(private world: World) {
        // Set the default archetype, which isn't expected to have a lot of components
        this.archetypes.set(0, this.defaultArchetype);

        this.entityArchetypes = new Int32Array(
            new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT * world.maxEntities)
        );
    }

    private saveInitialStateIfNotThere() {
        if (this.log[0] === null) return;

        this.log[0] = new Int32Array(this.entityArchetypes.length);
        this.entityArchetypes.set(this.log[0]);
    }

    loadFromData(data: any): void {
        // logger.log("Loading from data dump:", data);

        //@ts-ignore
        this.defaultArchetype = Object.create(
            LoggedArchetype.prototype,
            Object.getOwnPropertyDescriptors(data.defaultArchetype)
        );

        data.archetypes.forEach((archetype: Archetype, id: number) => {
            this.archetypes.set(
                id,
                Object.create(
                    LoggedArchetype.prototype,
                    Object.getOwnPropertyDescriptors(archetype)
                )
            );
        });

        //@ts-ignore
        this.entityArchetypes = data.entityArchetypes;
    }

    createNewArchetype(components: Set<number>) {
        // logger.log("Creating new archetype for components:", components);
        // Generate the next ID
        const sorted = [...components].sort((a, b) => a - b);
        let hash = 0;
        for (let i = 0; i < sorted.length; i++)
            hash = (Math.imul(31, hash) + sorted[i]) | 0;
        const nextId = hash;
        // this.nextIdLog[0] ??= this.nextArchetypeId;

        const newArchetype = new LoggedArchetype(
            nextId,
            components,
            this.world.maxEntities
        );
        this.world.queryManager.onNewArchetypeCreated(newArchetype);
        this.world.workerManager.onNewArchetypeCreated(newArchetype);
        this.archetypes.set(newArchetype.id, newArchetype);

        return newArchetype;
    }

    getOrCreateArchetype(components: Set<number>): LoggedArchetype {
        for (const [_, archetype] of this.archetypes) {
            if (archetype.components.size !== components.size) continue;

            let hasAll = true;
            for (const needed of components) {
                if (!archetype.components.has(needed)) {
                    hasAll = false;
                    break;
                }
            }

            if (hasAll) return archetype;
        }

        return this.createNewArchetype(components);
    }

    moveWithoutGraph(entity: Entity, from: LoggedArchetype, to: LoggedArchetype) {
        this.saveInitialStateIfNotThere();

        from.removeEntity(entity);
        to.addEntity(entity);
        this.entityArchetypes[entity] = to.id;
    }

    addEntity(entity: Entity) {
        this.saveInitialStateIfNotThere();

        this.entityArchetypes[entity] = 0;
        this.defaultArchetype.addEntity(entity);
    }

    removeEntity(entity: Entity) {
        this.saveInitialStateIfNotThere();

        this.moveWithoutGraph(
            entity,
            this.archetypes.get(this.entityArchetypes[entity])!,
            this.defaultArchetype
        );

        this.defaultArchetype.removeEntity(entity);
    }

    entityAddComponent(entity: Entity, component: number) {
        if (entity.has(component)) {
            throw new Error(
                "Entity" +
                    entity +
                    "tried to add component (ID:" +
                    component +
                    ") which it already had"
            );
        }

        this.saveInitialStateIfNotThere();

        // TODO: Make this faster
        const firstArchetype = this.archetypes.get(this.entityArchetypes[entity])!;

        firstArchetype.removeEntity(entity);

        if (!firstArchetype.graph.added.has(component)) {
            // Slow route
            for (const [id, candidateArchetype] of this.archetypes.entries()) {
                // Check length to make it a bit faster
                if (
                    candidateArchetype.components.size ==
                    firstArchetype.components.size + 1
                ) {
                    // Make sure it has all the old ones plus the new one
                    if (
                        candidateArchetype.components.has(component) &&
                        firstArchetype.components.every((c) =>
                            candidateArchetype.components.has(c)
                        )
                    ) {
                        firstArchetype.graph.added.set(
                            component,
                            candidateArchetype
                        );

                        break;
                    }
                }
            }

            if (!firstArchetype.graph.added.has(component)) {
                // If we get here, we need to create a new archetype
                const newArchetype = this.createNewArchetype(
                    firstArchetype.components.concat(component)
                );
                firstArchetype.graph.added.set(component, newArchetype);
            }
        }

        // Finally add everything
        const newArchetype = firstArchetype.graph.added.get(component)!;
        newArchetype.addEntity(entity);
        this.entityArchetypes[entity] = newArchetype.id;
    }

    entityRemoveComponent(entity: Entity, component: number) {
        if (!entity.has(component)) {
            throw new Error(
                "Entity" +
                    entity +
                    "tried to remove component (ID:" +
                    component +
                    ") which it didn't have"
            );
        }
        this.saveInitialStateIfNotThere();

        // Very similar to entityAddComponent, check there for comments
        const firstArchetype = this.archetypes.get(this.entityArchetypes[entity])!;

        firstArchetype.removeEntity(entity);

        if (!firstArchetype.graph.removed.has(component)) {
            for (const [id, candidateArchetype] of this.archetypes) {
                if (
                    candidateArchetype.components.size ==
                    firstArchetype.components.size - 1
                ) {
                    if (
                        candidateArchetype.components.every(
                            (c) =>
                                c !== component && firstArchetype.components.has(c)
                        )
                    ) {
                        firstArchetype.graph.removed.set(
                            component,
                            candidateArchetype
                        );

                        break;
                    }
                }
            }

            if (!firstArchetype.graph.removed.has(component)) {
                const newArchetype = this.createNewArchetype(
                    firstArchetype.components.filter((x) => x !== component)
                );
                firstArchetype.graph.removed.set(component, newArchetype);
            }
        }

        const newArchetype = firstArchetype.graph.removed.get(component)!;
        newArchetype.addEntity(entity);
        this.entityArchetypes[entity] = newArchetype.id;
    }

    resize(maxEnts: number) {
        for (const [_, archetype] of this.archetypes) {
            //@ts-ignore Investigate
            archetype.resize(maxEnts);
        }
    }

    update() {
        if (this.log.unshift(null) > LOGGED_COMPONENT_STORAGE_BUFFER_SIZE) {
            this.log.pop();
        }

        for (const [_, archetype] of this.archetypes) {
            archetype.update();
        }
    }

    rollback(numFrames: number) {
        if (numFrames > LOGGED_COMPONENT_STORAGE_BUFFER_SIZE) {
            throw new Error("Out of bounds rollback");
        }

        // Start at the front and do stuff
        for (let i = numFrames; i > -1; i--) {
            if (this.log[i] === null) continue;
            this.entityArchetypes.set(this.log[i]!);
            break;
        }

        this.log.splice(0, numFrames + 1);
        this.archetypes.forEach((archetype) => archetype.rollback(numFrames));

        // for (const [_, archetype] of this.archetypes) {
        //     archetype.rollback(numFrames);
        // }
    }
}
