import { World } from "bagelecs";
import { NetworkConnection } from "../../engine/multiplayer/network";
import {
    ExtractPayload,
    State,
    StateClass,
    StateManager,
} from "../../engine/state_managment";
import { AccentButton, PrimaryButton } from "../hud/components/button";
import type { Menu } from "./menu";

export class GameOverState extends State<never> {
    public element = (
        <div className="absolute top-0 left-0 w-full h-full z-50"></div>
    ) as HTMLDivElement;

    private menuState!: typeof Menu;
    constructor(world: World) {
        super(world);
        import("./menu").then((m) => {
            this.menuState = m.Menu;
        });
    }

    async onEnter() {
        document.body.appendChild(this.element);
        this.element.appendChild(this.getHTML());

        this.world.get(NetworkConnection).close();
    }

    private getHTML() {
        return (
            <div className="w-full h-full bg-base bg-opacity-80 ">
                <div className="absolute w-full bottom-0 p-1 bg-base bg-opacity-20 m-2 rounded-md">
                    <AccentButton onclick={() => null}>Play Again</AccentButton>
                    <PrimaryButton
                        id="playButton"
                        onclick={() =>
                            this.world.get(StateManager).moveTo(this.menuState)
                        }
                    >
                        Exit
                    </PrimaryButton>
                </div>
            </div>
        );
    }

    async onLeave() {
        this.element.remove();
        this.element.innerHTML = "";
    }
}
