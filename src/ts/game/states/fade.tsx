import { World } from "bagelecs";
import {
    ExtractPayload,
    State,
    StateClass,
    StateManager,
} from "../../engine/state_managment";
import { MenuBackground } from "../hud/background";

export class FadeState extends State<never> {
    private readonly element = (
        <MenuBackground className="z-50 opacity-0 transition-opacity duration-1000"></MenuBackground>
    ) as HTMLDivElement;

    async onEnter<From extends StateClass<any>>(
        payload: never,
        from: From
    ): Promise<void> {
        document.body.appendChild(this.element);
        this.element.style.opacity = "1";
        await Promise.timeout(1000);
    }

    async onLeave<Into extends StateClass<any>>(to: Into) {
        this.element.style.opacity = "0";
        // Promise.timeout(300).then(() => this.element.remove());
    }
}

declare module "../../engine/state_managment" {
    interface StateManager {
        fadeTo(
            state: StateClass,
            payload?: ExtractPayload<StateClass>
        ): Promise<void>;
    }
}

const duration = 150;
const fadeElement = (
    <MenuBackground className="z-50 transition-opacity opacity-0 pointer-events-none"></MenuBackground>
) as HTMLDivElement;

StateManager.prototype.fadeTo = async function (state, payload) {
    document.body.appendChild(fadeElement);
    await Promise.timeout(0);
    fadeElement.style.opacity = "1";
    await Promise.timeout(duration);
    await this.currentStateInstance.onLeave(state);
    let newStateInstance: State;
    if (this.states.has(state)) newStateInstance = this.states.get(state)!;
    else {
        newStateInstance = new state(this.world);
        this.states.set(state, newStateInstance);
    }
    let oldState = this.currentState;
    this.currentState = state;
    this.currentStateInstance = newStateInstance;
    await this.currentStateInstance.onEnter(payload, oldState);
    fadeElement.style.opacity = "0";
    await Promise.timeout(duration);
};
