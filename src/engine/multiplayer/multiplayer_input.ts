import { Entity, World } from "bagelecs";
import { AnalogBinding, ButtonState, DigitalBinding, Input } from "../input";
import { NetworkConnection } from "./network";
import { RollbackManager } from "./rollback";
import { ResourceUpdaterPlugin, ResourceUpdaterSystem } from "../resource";

export interface Bindings {}

type AnalogBindingKey = keyof Bindings;

type DigitalBindingKey = keyof {
    [key in keyof Bindings as Bindings[key] extends DigitalBinding ? key : never]: 0;
};

export type InputState = Record<string, number | ButtonState> & {
    __HASH__: number;
    __EVENTS__?: string[];
};

class InputEvent {
    constructor(
        public readonly name: string,
        public fire: (inputState: InputState) => boolean,
        public readonly relatedBindings: string[]
    ) {}

    static onPress(name: string, binding: string, ...relatedBindings: string[]) {
        return new InputEvent(
            name,
            (input) => input[binding] === "JUST_PRESSED",
            relatedBindings
        );
    }

    static onRelease(name: string, binding: string, ...relatedBindings: string[]) {
        return new InputEvent(
            name,
            (input) => input[binding] === "JUST_RELEASED",
            relatedBindings
        );
    }
}

export class MultiplayerInput {
    private readonly localInput: Input;

    public toLocalInput(replaceInWorld: boolean = true) {
        if (replaceInWorld) {
            this.world.remove(MultiplayerInput);
            this.world.add(this.localInput);
            this.world.disable(MultiplayerInputSystem);
        }

        return this.localInput;
    }

    constructor(public readonly world: World) {
        this.localInput = new Input(world);

        this.rollbackManager = world.get(RollbackManager);
        this.networkConnection = world.get(NetworkConnection);

        this.init();
    }

    static getId() {
        return Input.getId();
    }

    private static readonly bufferSize = 120;

    private readonly watchedBindings = {
        digital: new Set<string>(),
        analog: new Set<string>(),
    };

    private readonly buffers: Record<string, InputState[]> = {};
    private readonly knownFutureInputs = new Map<string, InputState>();

    private readonly localPeerId!: string;

    private readonly rollbackManager!: RollbackManager;
    private readonly networkConnection!: NetworkConnection;

    private readonly events: InputEvent[] = [];

    async init() {
        await this.networkConnection.awaitReady();

        //@ts-ignore
        this.localPeerId = this.networkConnection.id;
        this.buffers[this.localPeerId] = new Array(MultiplayerInput.bufferSize).fill(
            {}
        );

        this.networkConnection.newConnectionListeners.add((conn) => {
            const arr = new Array(MultiplayerInput.bufferSize).fill({});

            this.buffers[conn.peer] = arr;
        });

        this.localInput.init();
    }

    addEvent(event: InputEvent) {
        this.events.push(event);
    }

    removeEvent(event: InputEvent | string) {
        if (typeof event !== "string") {
            this.events.splice(this.events.indexOf(event), 1);
            return;
        }

        this.events.splice(this.events.findIndex((e) => e.name === event)!, 1);
    }

    wasFired(clientId: string, event: string): boolean {
        return (
            this.buffers[clientId][
                this.rollbackManager.currentFramesBack
            ].__EVENTS__?.includes(event) || false
        );
    }

    is(
        clientId: string,
        bindingName: DigitalBindingKey,
        state: ButtonState
    ): boolean {
        return (
            this.buffers[clientId][this.rollbackManager.currentFramesBack][
                bindingName
            ] === state
        );
    }

    get(clientId: string, bindingName: AnalogBindingKey): number {
        const val =
            this.buffers[clientId][this.rollbackManager.currentFramesBack][
                bindingName
            ];
        if (typeof val === "number") return val;
        return val === "JUST_PRESSED" || val === "PRESSED" ? 1 : 0;
    }

    bind(bindingName: AnalogBindingKey, binding: AnalogBinding): MultiplayerInput;
    bind(bindingName: DigitalBindingKey, binding: DigitalBinding): MultiplayerInput;

    bind(bindingName: AnalogBindingKey, binding: AnalogBinding | DigitalBinding) {
        this.localInput.bind(bindingName, binding);

        if (binding instanceof DigitalBinding) {
            this.watchedBindings.digital.add(bindingName);
        } else {
            this.watchedBindings.analog.add(bindingName);
        }
        return this;
    }

    private predictNextState(state: InputState): InputState {
        const newState = {} as InputState;
        for (const key of Object.keys(state)) {
            if (key === "__EVENTS__") continue;

            newState[key] = state[key];
            if (state[key] === "JUST_PRESSED") newState[key] = "PRESSED";
            else if (state[key] === "JUST_RELEASED") newState[key] = "RELEASED";
        }

        this.hashState(newState);

        return newState;
    }

    private oldHash: number | null = null;

    update(): void {
        if (this.world.get(RollbackManager).currentlyInRollback) return;

        this.localInput.update();

        for (let i = this.networkConnection.remoteIds.length - 1; i > -1; i--) {
            const peerId = this.networkConnection.remoteIds[i];
            const remoteBuffer = this.buffers[peerId];

            let newState: InputState;

            let knownFuture = this.knownFutureInputs.get(
                peerId + "-" + this.networkConnection.timeConnectedTo[peerId]
            );
            if (knownFuture) {
                newState = knownFuture;
            } else {
                newState = this.predictNextState(remoteBuffer[0]);
            }

            remoteBuffer.unshift(newState);
            remoteBuffer.pop();
        }

        // We store what the state was at the start of the frame, bc inputsystem is run first
        const newLocalState = {} as InputState;
        this.buffers[this.localPeerId].unshift(newLocalState);
        this.buffers[this.localPeerId].pop();

        // Load all bindings
        for (const binding of this.watchedBindings.analog) {
            newLocalState[binding] = this.localInput.get(binding);
        }

        for (const binding of this.watchedBindings.digital) {
            newLocalState[binding] = this.localInput.state(binding);
        }

        // Load all events
        for (const event of this.events) {
            if (event.fire(newLocalState)) {
                newLocalState.__EVENTS__ ??= [];
                newLocalState.__EVENTS__!.push(event.name);

                for (const binding of event.relatedBindings) {
                    if (binding in newLocalState) continue;

                    if (this.watchedBindings.digital.has(binding)) {
                        newLocalState[binding] = this.localInput.get(binding);
                    } else {
                        newLocalState[binding] = this.localInput.state(binding);
                    }
                }
            }
        }

        this.hashState(newLocalState);

        if (
            this.oldHash !== newLocalState.__HASH__ &&
            this.networkConnection.remoteIds.length
        ) {
            this.networkConnection.send("input", newLocalState);
        }

        this.oldHash = newLocalState.__HASH__;

        this.handleRemotePackets();
    }

    private hashState(state: InputState) {
        let hash = 0;

        for (const [key, value] of Object.entries(state)) {
            if (key === "__HASH__") continue;

            for (let i = 0; i < key.length; i++)
                hash = (Math.imul(31, hash) + key.charCodeAt(i)) | 0;

            const valStr = value.toString();
            for (let i = 0; i < valStr.length; i++)
                hash = (Math.imul(31, hash) + valStr.charCodeAt(i)) | 0;
        }

        state.__HASH__ = hash;
    }

    private handleRemotePackets() {
        let farthestRollbackFrame = 0;
        this.networkConnection.newMessagesByType.get("input")?.forEach((message) => {
            // Future input,
            if (message.frame > this.networkConnection.timeConnectedTo[message.id]) {
                this.knownFutureInputs.set(
                    message.id + "-" + message.frame,
                    message.data
                );
                return;
            }

            const framesBack =
                this.networkConnection.timeConnectedTo[message.id] - message.frame;
            const remote = this.buffers[message.id];

            if (message.data.__HASH__ === remote[framesBack].__HASH__) {
                return;
            }

            let state = message.data;
            for (let i = framesBack; i > -1; i--) {
                remote[i] = state;
                state = this.predictNextState(state);
            }

            farthestRollbackFrame = Math.max(farthestRollbackFrame, framesBack);
        });

        if (farthestRollbackFrame > 0) {
            this.rollbackManager.startRollback(farthestRollbackFrame);
        }
    }
}

export const MultiplayerInputSystem = ResourceUpdaterSystem(MultiplayerInput);
export const MultiplayerInputPlugin = async (world: World) => {
    world.add(new MultiplayerInput(world));
    await world.get(NetworkConnection).awaitReady();
    world.addSystem(MultiplayerInputSystem);
};
