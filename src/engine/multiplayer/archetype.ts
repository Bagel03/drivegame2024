import {
    Archetype,
    ArchetypeManager,
    Entity,
    Type,
    TypeIdBuilder,
    World,
} from "bagelecs";

declare module "bagelecs" {
    //@ts-expect-error
    interface ArchetypeManager extends LoggedArchetypeManager {}
}

export class LoggedArchetype extends Archetype {
    private readonly bufferSize: number = TypeIdBuilder.defaultLoggedBufferSize;
    public readonly log: (Int32Array | null)[] = new Array(this.bufferSize).fill(
        null
    );

    private logInitalState() {
        this.log[0] = new Int32Array(this.entities.length);
        this.entities.set(this.log[0]);
    }

    addEntity(entity: Entity): void {
        if (this.log[0] === null) this.logInitalState();
        super.addEntity(entity);
    }

    removeEntity(entity: Entity): void {
        if (this.log[0] === null) this.logInitalState();
        super.removeEntity(entity);
    }

    update() {
        if (this.log.unshift(null) > this.bufferSize) {
            this.log.pop();
        }
    }

    rollback(numFrames: number) {
        if (numFrames > this.bufferSize) {
            throw new Error("Out of bounds rollback");
        }

        // Start at the front and do stuff
        for (let i = numFrames; i > -1; i--) {
            if (this.log[i] === null) continue;

            this.log[i]!.set(this.entities);
            break;
        }

        this.log.splice(0, numFrames + 1);
    }
}

export class LoggedArchetypeManager {
    public readonly archetypes: Map<number, LoggedArchetype> = new Map();
    public readonly entityArchetypes: Int32Array;
    protected nextArchetypeId = 1;

    private readonly bufferSize = TypeIdBuilder.defaultLoggedBufferSize;
    private readonly log: (Int32Array | null)[] = new Array(this.bufferSize);
    public readonly nextIdLog: (number | null)[] = new Array(this.bufferSize);

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
        this.nextIdLog[0] ??= this.nextArchetypeId;

        const newArchetype = new LoggedArchetype(
            this.nextArchetypeId++,
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
        this.nextIdLog.unshift(null);
        if (this.log.unshift(null) > this.bufferSize) {
            this.log.pop();
            this.nextIdLog.pop();
        }

        for (const [_, archetype] of this.archetypes) {
            archetype.update();
        }
    }

    rollback(numFrames: number) {
        if (numFrames > this.bufferSize) {
            throw new Error("Out of bounds rollback");
        }

        // Start at the front and do stuff
        for (let i = numFrames; i > -1; i--) {
            if (this.log[i] === null) continue;
            this.nextArchetypeId = this.nextIdLog[i]!;
            this.log[i]!.set(this.entityArchetypes);
            break;
        }

        this.log.splice(0, numFrames + 1);

        for (const [_, archetype] of this.archetypes) {
            archetype.rollback(numFrames);
        }
    }
}
