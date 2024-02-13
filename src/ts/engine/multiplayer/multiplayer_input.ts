import { Entity, World } from "bagelecs";
import {
    AnalogBindingKey,
    Bindings,
    ButtonState,
    DigitalBindingKey,
    Input,
    InputMethodName,
} from "../input/input";
import { NetworkConnection } from "./network";
import { RollbackManager } from "./rollback";
import { ResourceUpdaterPlugin, ResourceUpdaterSystem } from "../resource";
import { Diagnostics } from "../diagnostics";
import { DigitalBinding } from "../input/input_bindings";
import { DESIRED_FRAME_TIME, runOffSchedulePhysicsUpdate } from "../loop";

export type InputState = Record<string, number | ButtonState> & {
    __HASH__: number;
    __EVENTS__?: string[];
};

class InputEvent {
    constructor(
        public readonly name: string,
        public fire: (inputState: InputState) => boolean,
        public readonly relatedBindings: AnalogBindingKey[]
    ) {}

    static onPress(
        name: string,
        binding: string,
        ...relatedBindings: (keyof Bindings)[]
    ) {
        return new InputEvent(
            name,
            (input) => input[binding] === "JUST_PRESSED",
            relatedBindings
        );
    }

    static onRelease(
        name: string,
        binding: string,
        ...relatedBindings: (keyof Bindings)[]
    ) {
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
        digital: new Set<DigitalBindingKey>(),
        analog: new Set<AnalogBindingKey>(),
    };

    public readonly buffers: Record<string, InputState[]> = {};
    // Map<Frames Connected, input state>
    public readonly knownFutureInputs = new Map<number, InputState>();

    private readonly localPeerId!: string;

    private readonly rollbackManager!: RollbackManager;
    private readonly networkConnection!: NetworkConnection;

    private readonly events: InputEvent[] = [];

    public ready: boolean = false;
    async init() {
        await this.networkConnection.waitForServerConnection;
        //@ts-expect-error
        this.localPeerId = this.networkConnection.id;
        this.buffers[this.localPeerId] = new Array(MultiplayerInput.bufferSize).fill(
            {}
        );

        this.networkConnection.addEventListener("connect", () => {
            this.buffers[this.networkConnection.remoteId] = new Array(
                MultiplayerInput.bufferSize
            ).fill({});
        });
        this.handleRemotePackets();

        this.localInput.init();
        this.ready = true;
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

    wasFired(event: string, clientId: string = this.networkConnection.id): boolean {
        return (
            this.buffers[clientId][
                this.rollbackManager.currentFramesBack
            ].__EVENTS__?.includes(event) || false
        );
    }

    is(
        bindingName: DigitalBindingKey,
        state: ButtonState,
        clientId: string = this.networkConnection.id
    ): boolean {
        const realState =
            this.buffers[clientId][this.rollbackManager.currentFramesBack][
                bindingName
            ];

        if (realState === state) return true;
        if (realState === "JUST_PRESSED" && state === "PRESSED") return true;
        if (realState === "JUST_RELEASED" && state === "RELEASED") return true;
        return false;
    }

    get(
        bindingName: AnalogBindingKey,
        clientId: string = this.networkConnection.id
    ): number {
        const val =
            this.buffers[clientId][this.rollbackManager.currentFramesBack][
                bindingName
            ];
        if (typeof val === "number") return val;
        return val === "JUST_PRESSED" || val === "PRESSED" ? 1 : 0;
    }

    // bind(bindingName: AnalogBindingKey, binding: AnalogBinding): MultiplayerInput;
    // bind(bindingName: DigitalBindingKey, binding: DigitalBinding): MultiplayerInput;

    // bind(bindingName: AnalogBindingKey, binding: AnalogBinding | DigitalBinding) {
    //     this.localInput.bind(bindingName, binding);

    //     if (binding instanceof DigitalBinding) {
    //         this.watchedBindings.digital.add(bindingName);
    //     } else {
    //         this.watchedBindings.analog.add(bindingName);
    //     }
    //     return this;
    // }

    addInputMethod(method: InputMethodName, bindings: Bindings) {
        this.localInput.addInputMethod(method, bindings);

        for (const [key, val] of Object.entries(bindings)) {
            if (val instanceof DigitalBinding) {
                this.watchedBindings.digital.add(key as DigitalBindingKey);
            } else {
                this.watchedBindings.analog.add(key);
            }
        }
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
        if (this.world.get(RollbackManager).currentlyInRollback || !this.ready)
            return;

        this.localInput.update();

        if (this.networkConnection.isConnected) {
            let newRemoteState: InputState;
            if (this.knownFutureInputs.has(this.networkConnection.framesConnected)) {
                newRemoteState = this.knownFutureInputs.get(
                    this.networkConnection.framesConnected
                )!;
                // console.log(
                //     "Using future input frame",
                //     this.networkConnection.framesConnected,
                //     newRemoteState.x
                // );
            } else {
                newRemoteState = this.predictNextState(
                    this.buffers[this.networkConnection.remoteId][0]
                );
            }

            this.buffers[this.networkConnection.remoteId].unshift(newRemoteState);
            this.buffers[this.networkConnection.remoteId].pop();
        }

        // We store what the state was at the start of the frame, bc input system is run first
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

                    if (
                        this.watchedBindings.digital.has(
                            binding as DigitalBindingKey
                        )
                    ) {
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
            this.networkConnection.isConnected
        ) {
            // console.log(
            // //     "Input change on frame",
            // //     this.networkConnection.framesConnected,
            // //     newLocalState.x
            // // );
            this.networkConnection.send("input", {
                frame: this.networkConnection.framesConnected,
                inputState: newLocalState,
            });
        }

        this.oldHash = newLocalState.__HASH__;
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

    private awaitFrame(frame: number) {
        return new Promise<void>((resolve) => {
            const interval = setInterval(() => {
                if (this.networkConnection.framesConnected > frame) {
                    clearInterval(interval);
                    resolve();
                }
            }, DESIRED_FRAME_TIME);
        });
    }

    private handleRemotePackets() {
        this.networkConnection.on<{ frame: number; inputState: InputState }>(
            "input",
            async ({ frame, inputState }) => {
                // Lets try this one :)
                // await this.awaitFrame(frame);

                let framesBack = this.networkConnection.framesConnected - frame;
                // Diagnostics.worstRemoteLatency = framesBack;
                // Handle future inputs
                if (framesBack < 0) {
                    //     for (let i = 0; i < -framesBack; i++) {
                    //         console.log("Running panic/catchup frame");
                    //         // runOffSchedulePhysicsUpdate(this.world, -framesBack);
                    //         this.world.tick();
                    //     }
                    //     // this.world.tick();
                    this.knownFutureInputs.set(frame, inputState);
                    //     // console.log("Got future input", frame);
                    return;
                    // framesBack = 0;
                }

                // If the hashes match, do nothing
                // if (
                //     inputState.__HASH__ ===
                //     this.buffers[this.networkConnection.remoteId][0].__HASH__
                // ) {
                //     return;
                // }

                // At this point, theres an input mismatch and were gonna rollback
                // But first ima correct the buffer
                let state = inputState;
                for (let i = framesBack; i > -1; i--) {
                    this.buffers[this.networkConnection.remoteId][i] = state;
                    state = this.predictNextState(state);
                }
                this.rollbackManager.startRollback(framesBack);
            }
        );
    }
}

export const MultiplayerInputSystem = ResourceUpdaterSystem(MultiplayerInput);
export const MultiplayerInputPlugin = (world: World) => {
    world.add(new MultiplayerInput(world));
    world.addSystem(MultiplayerInputSystem, "DEFAULT", false);
    world.addSystem(MultiplayerInputSystem, "rollback", false);
};

export const startMultiplayerInput = async (world: World) => {
    world.enable(MultiplayerInputSystem, "DEFAULT");
    world.enable(MultiplayerInputSystem, "rollback");
};
