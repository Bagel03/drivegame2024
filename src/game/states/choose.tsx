import { NetworkConnection } from "../../engine/multiplayer/network";
import {
    ExtractPayload,
    State,
    StateClass,
    StateManager,
} from "../../engine/state_managment";
import { MenuBackground } from "../hud/background";
import { Menu } from "./menu";

export class ChooseGameMode extends State {
    private element = (
        <div
            id="game-state-chooser"
            className="absolute top-0 left-0 w-full h-full"
        ></div>
    );

    private selectedMode!: "solo" | "battle" | "co-op";

    async onEnter<From extends StateClass<any>>(
        payload: any,
        from: From
    ): Promise<void> {
        document.body.append(this.element);

        if (this.world.get(NetworkConnection).isConnected) {
            this.element.appendChild(this.getMainHTML());
        } else {
            this.selectedMode = "solo";
            this.element.appendChild(this.getMapHTML());
        }
    }

    async onLeave() {}

    update(): void {}

    private getMainHTML() {
        return (
            <MenuBackground>
                <div className="grid grid-cols-3 p-2">
                    {["Solo", "Friendly Battle", "CO - OP"].map((name) => (
                        <div
                            className="bg-menuBackgroundAccent border-white m-3 p-1 h-auto cursor-pointer"
                            onclick={() => {
                                this.selectedMode = name.toLowerCase() as any;
                                this.element.replaceChild(
                                    this.element.firstChild!,
                                    this.getMapHTML()
                                );
                            }}
                        >
                            <h1 className="w-full text-center text-white text-3xl mt-4">
                                {name}
                            </h1>
                        </div>
                    ))}
                </div>
                <div></div>
            </MenuBackground>
        );
    }

    private getMapHTML() {
        return (
            <MenuBackground>
                <div className="grid grid-cols-3 p-2 h-full">
                    {[
                        "Lunchroom",
                        "Gym",
                        "The Elm",
                        "USA Hokey Arena",
                        "Room 127",
                        "The Halls",
                    ].map((name) => this.smallTile(name))}
                </div>
            </MenuBackground>
        );
    }

    private smallTile(name: string) {
        return (
            <div
                className="bg-menuBackground border-white m-3 p-1 h-auto rounded-md bg-opacity-30 cursor-pointer"
                onclick={() =>
                    this.world.get(StateManager).moveTo(Menu, {
                        gameMode: this.selectedMode,
                        map: name,
                    })
                }
            >
                <h1 className="w-full text-center text-white text-3xl mt-4 opacity-100">
                    {name}
                </h1>
            </div>
        );
    }
}
