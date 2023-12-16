import { Class, World } from "bagelecs";

export abstract class State<T = any> {
    public static readonly recordInHistory: boolean = true;

    constructor(public readonly world: World) {}

    abstract onEnter<From extends StateClass>(
        payload: T,
        from: From
    ): Promise<void>;
    abstract update(): void;
    abstract onLeave<Into extends StateClass>(
        to: Into
    ): Promise<void> | Promise<ExtractPayload<Into>>;
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

export type ExtractPayload<T extends StateClass> = T extends Class<
    State<infer U>
>
    ? U
    : never;

export class StateManager {
    private readonly states = new Map<StateClass, State>();
    private currentState!: StateClass;
    private currentStateInstance!: State;

    private readonly history: StateClass[] = [];

    constructor(public readonly world: World) {
        this.currentState = DefaultState;
        this.currentStateInstance = new DefaultState(this.world);
        this.states.set(DefaultState, this.currentStateInstance);
    }

    async moveTo<T>(
        state: StateClass<T>,
        payload: T,
        useExitPayloadIfAvailable: boolean = false
    ) {
        let stateInstance: State<T>;
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

        if (this.currentState.recordInHistory)
            this.history.push(this.currentState);

        this.currentState = state;
        this.currentStateInstance = stateInstance;
    }

    async back(
        payload?: any,
        useExitPayloadIfAvailable: boolean = false
    ): Promise<boolean> {
        if (this.history.length === 0) return false;

        await this.moveTo(
            this.history.pop()!,
            payload,
            useExitPayloadIfAvailable
        );
        this.history.pop();
        return true;
    }
}

export function StateManagementPlugin(world: World) {
    world.add(new StateManager(world));
}
