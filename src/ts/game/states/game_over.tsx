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
import { MatchInfo } from "../components/match_info";
import { Players } from "../players";

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
        const playerStats = [
            "bulletsShot",
            "bulletsHit",
            "bulletsReceived",
            "ultsUsed",
        ] as const;
        const player1Stats = playerStats.map(
            (s) => this.world.get(MatchInfo).info.player1.stats[s]
        );
        const player2Stats = playerStats.map(
            (s) => this.world.get(MatchInfo).info.player2.stats[s]
        );

        (player1Stats as any).splice(
            2,
            0,
            (Math.floor((player1Stats[1] * 100) / player1Stats[0]) || 0) + "%"
        );
        (player2Stats as any).splice(
            2,
            0,
            (Math.floor((player2Stats[1] * 100) / player2Stats[0]) || 0) + "%"
        );

        const statNames = [
            "Tickets Thrown",
            "Tickets Sold",
            "Accuracy",
            "Tickets Bought",
            "Ultimates Used",
        ];

        const statEls = [player1Stats, statNames, player2Stats];
        const info = this.world.get(MatchInfo).info;
        return (
            <div className="w-full h-full bg-base bg-opacity-80 flex flex-col">
                <div className="grid grid-cols-5 grow">
                    <div className="flex flex-col justify-center text-center">
                        <span className="text-2xl">
                            {info.winner == "player1" ? "WINNER" : <br />}
                        </span>
                        <img
                            src={
                                Players[
                                    this.world.get(MatchInfo).info.player1.player
                                ].menuPic
                            }
                        ></img>
                        {this.world.get(MatchInfo).info.player1.name}
                    </div>
                    {statEls.map((stats) => (
                        <div className=" flex flex-col justify-center">
                            {stats.map((stat, i) => (
                                <div className="text-center">{stat}</div>
                            ))}
                        </div>
                    ))}
                    <div className="flex flex-col justify-center text-center">
                        <span className="text-2xl">
                            {info.winner == "player2" ? "WINNER" : <br />}
                        </span>
                        <img src={Players[info.player2.player].menuPic}></img>
                        {info.player2.name}
                    </div>
                </div>
                <div className="bottom-0 flex p-1 bg-base bg-opacity-20 m-2 rounded-md">
                    <AccentButton onclick={() => null}>Play Again</AccentButton>
                    <PrimaryButton
                        className="ml-auto"
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
