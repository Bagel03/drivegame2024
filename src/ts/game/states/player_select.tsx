import { NetworkConnection } from "../../engine/multiplayer/network";
import {
    ExtractPayload,
    State,
    StateClass,
    StateManager,
} from "../../engine/state_managment";
import { MenuBackground } from "../hud/background";
import { Players } from "../players";
import { Menu } from "./menu";

export class PlayerSelect extends State<never> {
    private inManualMode: boolean = false;

    async onEnter(): Promise<void> {
        document.body.append(this.getHTML());
        this.handleScroll();

        const localPlayer = this.world.get("localPlayer");

        const active = document.querySelector<HTMLDivElement>(
            `div[data-playerName="${localPlayer}"]`
        );

        active!.style.scale = "1.4";
        active!.querySelector<HTMLElement>(".description")!.style.opacity = "1";

        active?.parentElement?.scroll({
            left: active.offsetLeft - 100,
            behavior: "smooth",
        });

        this.inManualMode = false;

        await Promise.timeout(100);
        this.inManualMode = true;
        // setTimeout(() => {
        //     this.inManualMode = true;
        // }, 100);
    }

    onLeave<Into extends StateClass<any>>(
        to: Into
    ): Promise<void> | Promise<ExtractPayload<Into>> {
        document.querySelector("#playerSelect")?.remove();
        return Promise.resolve();
    }

    private localPlayer!: string;

    getHTML() {
        return (
            <MenuBackground id="playerSelect" className="flex flex-col">
                <div className="text-4xl p-5 flex align-middle items-center">
                    <div
                        onclick={() => {
                            this.world.get(StateManager).fadeTo(Menu);
                        }}
                    >
                        <i className="fa-solid fa-arrow-left mr-5 hover:cursor-pointer"></i>
                    </div>
                    <span>Players</span>
                </div>
                {/* This should create a carousel of each player */}
                <div className="flex align-middle justify-center items-center flex-grow">
                    <div
                        id="carousel"
                        className="scroll-smooth overflow-x-scroll snap-mandatory snap-x w-full whitespace-nowrap overflow-y-visible mt-[-2rem] pt-8 pb-8 scrollbar-hidden"
                        onmousedown={(e) => {
                            const target = e.currentTarget as HTMLDivElement;
                            target.dataset.dragging = "true";
                            target.style.scrollSnapType = "none";
                            target.style.scrollBehavior = "auto";
                        }}
                        onmouseup={(e) => {
                            const target = e.currentTarget as HTMLDivElement;
                            target.dataset.dragging = "false";
                            target.style.scrollSnapType = "x mandatory";
                            target.style.scrollBehavior = "smooth";
                        }}
                        onmousemove={function (e) {
                            const target = e.currentTarget as HTMLDivElement;
                            target.dataset.dragging === "true" &&
                                (target.scrollLeft -= e.movementX);
                        }}
                    >
                        {Object.values(Players).map((player, i, { length }) => (
                            <div
                                className={`w-96 inline-block snap-center ${
                                    i === 0
                                        ? "ml-[calc((96rem/2))]"
                                        : i === length - 1
                                        ? "mr-[calc((96rem/2))]"
                                        : ""
                                }`}
                                data-playerName={player.name}
                            >
                                <div className="w-full flex flex-col items-center">
                                    <img src={player.menuPic} className="h-48 " />
                                    <h1>{player.displayName}</h1>
                                    <h4 className="opacity-0 w-[60vw] whitespace-normal text-xs text-center description">
                                        {player.description}
                                    </h4>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </MenuBackground>
        );
    }

    handleScroll() {
        const carousel = document.querySelector("#carousel")!;

        carousel.lastElementChild!.scrollIntoView({
            behavior: "instant",
            block: "center",
            inline: "center",
        });
        const maxWidth = carousel.scrollLeft;
        carousel.firstElementChild!.scrollIntoView({
            behavior: "instant",
            block: "center",
            inline: "center",
        });
        const offsetWidth = carousel.scrollLeft;

        // Reset this
        document.documentElement.scrollTo(0, 0);

        const allPlayers = Array.from<HTMLElement>(carousel.children as any);
        const allDescriptions = allPlayers.map((player) =>
            player.querySelector<HTMLElement>(".description")
        );

        carousel.addEventListener("scroll", () => {
            if (!this.inManualMode) return;

            const indexUnrounded =
                ((carousel.scrollLeft - offsetWidth) / (maxWidth - offsetWidth)) *
                (Object.values(Players).length - 1);
            const index = Math.round(indexUnrounded);

            if (carousel.children[index]) {
                allPlayers.forEach(
                    (el, i) =>
                        (el.style.scale = "1") &&
                        (allDescriptions[i]!.style.opacity = "0")
                );

                const element = carousel.children[index] as HTMLDivElement;
                const name = element.dataset.playername!;
                if (name !== this.world.get("localPlayer")) {
                    this.world.get(NetworkConnection).post("playerChange");
                    this.world.set("localPlayer", element.dataset.playername!);
                }

                element.style.scale =
                    1 + 0.4 * (1 - Math.abs(indexUnrounded - index) - 0.5) + "";

                let opacity = 2 * (1 - Math.abs(indexUnrounded - index) - 0.5);
                if (opacity < 0.1) opacity = 0;
                if (opacity > 0.9) opacity = 1;
                (
                    element.firstElementChild!.lastElementChild as HTMLDivElement
                ).style.opacity = opacity + "";
            }
        });
    }
}
