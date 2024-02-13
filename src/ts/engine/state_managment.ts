import { Class, System, With, World } from "bagelecs";

export abstract class State<T = any> {
    public static readonly recordInHistory: boolean = true;

    constructor(public readonly world: World) {}

    abstract onEnter<From extends StateClass>(
        payload: T extends never ? undefined : T,
        from: From
    ): Promise<void>;
    update(): void {}
    onLeave<Into extends StateClass>(
        to: Into
    ): Promise<void> | Promise<ExtractPayload<Into>> {
        return null as any;
    }
}

export type StateClass<T = any> = Class<State<T>> & {
    readonly recordInHistory: boolean;
};

class DefaultState extends State<never> {
    static readonly recordInHistory = false;
    async onEnter() {}
    update() {}
    async onLeave() {}
}

export type ExtractPayload<T extends StateClass> = T extends Class<State<infer U>>
    ? U
    : never;

export class StateManager {
    public readonly states = new Map<StateClass, State>();
    public currentState!: StateClass;
    public currentStateInstance!: State;

    private readonly history: StateClass[] = [];

    constructor(public readonly world: World) {
        this.currentState = DefaultState;
        this.currentStateInstance = new DefaultState(this.world);
        this.states.set(DefaultState, this.currentStateInstance);
    }

    async moveTo(state: StateClass<never>): Promise<void>;
    async moveTo<
        T extends StateClass,
        U extends T extends StateClass<infer U> ? U : never
    >(state: T, payload: U, useExitPayloadIfAvailable?: boolean): Promise<void>;

    async moveTo(
        state: StateClass,
        payload = undefined,
        useExitPayloadIfAvailable = false
    ) {
        let stateInstance: State<any>;
        if (this.states.has(state)) stateInstance = this.states.get(state)!;
        else {
            stateInstance = new state(this.world);
            this.states.set(state, stateInstance);
        }

        const oldPayload = await this.currentStateInstance.onLeave(state);
        if (oldPayload && useExitPayloadIfAvailable) {
            await stateInstance.onEnter(oldPayload as any, this.currentState);
        } else {
            await stateInstance.onEnter(payload, this.currentState);
        }

        if (this.currentState.recordInHistory) this.history.push(this.currentState);

        this.currentState = state;
        this.currentStateInstance = stateInstance;
    }

    async back(
        payload?: any,
        useExitPayloadIfAvailable: boolean = false
    ): Promise<boolean> {
        if (this.history.length === 0) return false;

        await this.moveTo(this.history.pop()!, payload, useExitPayloadIfAvailable);
        this.history.pop();
        return true;
    }
}

class StateManagementUpdateSystem extends System(With(StateManager)) {
    update(): void {
        this.entities.forEach((ent) =>
            ent.get(StateManager).currentStateInstance.update()
        );
        this.world.get(StateManager).currentStateInstance.update();
    }
}

export function StateManagementPlugin(world: World) {
    world.add(new StateManager(world));

    world.addSystem(StateManagementUpdateSystem);
    world.addSystem(StateManagementUpdateSystem, "rollback");
}
