import {
    Archetype,
    ArchetypeManager,
    Entity,
    LOGGED_COMPONENT_STORAGE_BUFFER_SIZE,
    World,
} from "bagelecs";

// This logs all changes to the entities in this archetype and can rollback to any frame, similar to LoggedComponentStorage
// Whenever an entity is added or removed, the inital state of the archetype is saved
export class LoggedArchetype extends Archetype {
    private readonly log: (Int32Array | null)[] = [];

    private saveStartState(): void {
        if (this.log[0] == null) this.log.unshift(this.entities.slice());
    }

    addEntity(entity: Entity): void {
        // Dont have time to address root problem, bandaid fix
        if (
            this.entities.indexOf(entity) > 0 &&
            this.entities.indexOf(entity) <= this.entities[0]
        )
            return;

        this.saveStartState();
        super.addEntity(entity);
    }

    removeEntity(entity: Entity): void {
        this.saveStartState();
        super.removeEntity(entity);
    }

    update(): void {
        this.log.unshift(null);
        if (this.log.length > LOGGED_COMPONENT_STORAGE_BUFFER_SIZE) {
            this.log.pop();
        }
    }

    rollback(numFrames: number): void {
        for (let i = numFrames; i >= 0; i--) {
            if (this.log[i] == null) continue;
            //@ts-ignore
            this.entities = this.log[i];
            break;
        }

        this.log.splice(0, numFrames + 1);
    }
}

export class LoggedArchetypeManager extends ArchetypeManager {
    private readonly log: (Int32Array | null)[] = [];
    declare archetypes: Map<number, LoggedArchetype>;

    declare defaultArchetype: LoggedArchetype;

    constructor(world: World) {
        super(world);

        this.defaultArchetype = new LoggedArchetype(
            0,
            new Set(),
            this.world.maxEntities
        );
        this.archetypes.set(0, this.defaultArchetype);
    }

    private saveStartState(): void {
        if (this.log[0] == null) this.log.unshift(this.entityArchetypes.slice());
    }

    createNewArchetype(components: Set<number>): Archetype {
        const newId = [...components]
            .sort((a, b) => a - b)
            .reduce((hash, component) => (Math.imul(31, hash) + component) | 0, 0);
        const result = new LoggedArchetype(
            newId,
            components,
            this.world.maxEntities
        );
        this.world.queryManager.onNewArchetypeCreated(result);
        this.world.workerManager.onNewArchetypeCreated(result);
        this.archetypes.set(newId, result);
        return result;
    }

    entityAddComponent(entity: Entity, component: number): void {
        this.saveStartState();
        super.entityAddComponent(entity, component);
    }

    entityRemoveComponent(entity: Entity, component: number): void {
        this.saveStartState();
        super.entityRemoveComponent(entity, component);
    }

    addEntity(entity: Entity): void {
        this.saveStartState();
        super.addEntity(entity);
    }

    moveWithoutGraph(entity: Entity, from: Archetype, to: Archetype): void {
        this.saveStartState();
        super.moveWithoutGraph(entity, from, to);
    }

    update(): void {
        this.log.unshift(null);
        if (this.log.length > LOGGED_COMPONENT_STORAGE_BUFFER_SIZE) {
            this.log.pop();
        }

        this.archetypes.forEach((archetype) => archetype.update());
    }

    rollback(numFrames: number): void {
        for (let i = numFrames; i >= 0; i--) {
            if (this.log[i] == null) continue;
            //@ts-ignore
            this.entityArchetypes = this.log[i];
            break;
        }

        this.log.splice(0, numFrames + 1);
        this.archetypes.forEach((archetype) => archetype.rollback(numFrames));
    }
}
