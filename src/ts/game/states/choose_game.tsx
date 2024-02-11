import { NetworkConnection } from "../../engine/multiplayer/network";
import {
    ExtractPayload,
    State,
    StateClass,
    StateManager,
} from "../../engine/state_managment";
import { GameModes } from "../game_modes";
import { MenuBackground } from "../hud/background";
import { Menu } from "./menu";

export class ChooseGameMode extends State {
    private element = (
        <div
            id="game-state-chooser"
            className="absolute top-0 left-0 w-full h-full"
        ></div>
    ) as HTMLElement;

    private selectedMode!: "solo" | "battle" | "co-op";

    async onEnter<From extends StateClass<any>>(
        payload: any,
        from: From
    ): Promise<void> {
        document.body.append(this.element);

        this.element.appendChild(this.getMainHTML());

        document
            .querySelector<HTMLDivElement>(
                `[data-gamemodename="${this.world.get("selectedGameMode")}"]`
            )
            ?.click();
    }

    async onLeave() {
        this.element.remove();
    }

    update(): void {}

    private getMainHTML() {
        return (
            <MenuBackground className="flex flex-col">
                <div className="text-4xl p-5 flex align-middle items-center">
                    <i
                        className="fa-solid fa-arrow-left mr-5 hover:cursor-pointer"
                        onclick={() => {
                            this.world.get(StateManager).moveTo(Menu);
                        }}
                    ></i>
                    <span>Game Modes</span>
                </div>
                <div className="grid grid-cols-4 p-2 w-full flex-grow">
                    {Object.entries(GameModes).map(([game, info]) => (
                        <div
                            className={
                                "bg-menuBackgroundAccent border-white p-1 relative m-3 flex flex-col justify-between rounded-md transition-transform delay-[50] " +
                                (info.getIsAvailable(this.world) === true
                                    ? "hover:brightness-90 cursor-pointer"
                                    : "")
                            }
                            onclick={(ev) => {
                                if (info.getIsAvailable(this.world) !== true) return;
                                this.world.set("selectedGameMode", game);
                                const prev = document.querySelector<HTMLElement>(
                                    "[data-selectedgamemode]"
                                );
                                const target = ev.currentTarget as HTMLElement;

                                const classes = [
                                    "hover:brightness-90",
                                    "brightness-110",
                                    "scale-110",
                                    "-translate-y-3",
                                ];
                                for (const el of [prev, target]) {
                                    if (!el) continue;

                                    for (const cls of classes) {
                                        el.classList.toggle(cls);
                                    }
                                }

                                if (prev) delete prev.dataset.selectedgamemode;
                                target.dataset.selectedgamemode = "true";
                                this.world
                                    .get(NetworkConnection)
                                    .post("gameModeChange");
                            }}
                            data-gamemodename={game}
                        >
                            <i
                                className={`m-auto fa ${info.icon} text-5xl self-center`}
                            ></i>
                            <div className="text-center">
                                <div className="text-white text-3xl">
                                    {info.name}
                                </div>
                                <div className="text-white text-md">
                                    {info.description}
                                </div>
                            </div>
                            {info.getIsAvailable(this.world) !== true ? (
                                <div className="top-0 left-0 w-full h-full absolute text-center bg-base bg-opacity-80 rounded-md flex flex-col justify-center">
                                    {/* <div className="margin-auto flex flex-col justify-center"> */}
                                    <span className="md:text-3xl sm:text-2xl">
                                        Mode not available
                                    </span>
                                    <div className="text-md">
                                        {info.getIsAvailable(this.world)}
                                    </div>
                                    {/* </div> */}
                                </div>
                            ) : (
                                ""
                            )}
                        </div>
                    ))}
                </div>
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
