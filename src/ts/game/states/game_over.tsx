import { World } from "bagelecs";
import { NetworkConnection } from "../../engine/multiplayer/network";
import {
    ExtractPayload,
    State,
    StateClass,
    StateManager,
} from "../../engine/state_managment";
import { AccentButton, PrimaryButton } from "../hud/components/button";
import { Menu } from "./menu";
import { MatchInfo } from "../components/match_info";
import { Players } from "../players";
import { ServerConnection } from "../../engine/server";
import { AccountInfo } from "./login";
import { showDialog } from "../hud/components/dialogs";
import { MultiplayerInput } from "../../engine/multiplayer/multiplayer_input";
import { pause, resume } from "../../engine/loop";

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
        // await Promise.timeout(100);
        const nc = this.world.get(NetworkConnection);
        // if (!(await nc.fetch("gameOver")) && nc.isConnected) {
        //     showDialog({
        //         title: "Unstable Connection",
        //         message:
        //             "Your client believes it has won, while the remote client does not. This match will not count",
        //         hideCancelButton: true,
        //         onok: async () => {
        //             this.world.get(StateManager).fadeTo(this.menuState);
        //         },
        //     });
        //     return;
        // }

        document.body.appendChild(this.element);
        this.element.appendChild(this.getHTML());

        const player1Email = this.world.get<string>(
            nc.isPlayer1() ? AccountInfo.email : "remoteEmail"
        );
        const player2Email = this.world.get<string>(
            nc.isPlayer1() ? "remoteEmail" : AccountInfo.email
        );

        const winner =
            this.world.get(MatchInfo).info.winner === "player1"
                ? player1Email // this.world.get(NetworkConnection).player1
                : player2Email; //this.world.get(NetworkConnection).player2;

        pause();
        this.world.remove(MatchInfo);
        const mi = this.world.get(MultiplayerInput);
        mi.knownFutureInputs.clear();
        //@ts-ignore
        mi.buffers = {};
        mi.ready = false;
        mi.init();
        // this.world.get(NetworkConnection).close();

        const results = await this.world
            .get(ServerConnection)
            .fetch("/matchmaking/gameOver", {
                searchParams: {
                    isGuest: this.world.get(AccountInfo.isGuest).toString(),
                    id: this.world.get(NetworkConnection).id,
                    gameId: this.world.get("matchId"),
                    email: this.world.get(AccountInfo.email),
                    winner,
                },
            });

        console.log("Got game over results", results);

        if (this.world.get(AccountInfo.email) === results.winner) {
            console.log(
                "Adding winnings",
                this.world.get(AccountInfo.trophies) + results.trophies,
                this.world.get(AccountInfo.wins)
            );
            this.world.set(
                AccountInfo.trophies,
                this.world.get(AccountInfo.trophies) + results.trophies
            );
            this.world.set(AccountInfo.wins, this.world.get(AccountInfo.wins) + 1);
            // Play some animation
        } else {
            console.log(
                "Removing trophies",
                Math.max(this.world.get(AccountInfo.trophies) - results.trophies, 0)
            );
            this.world.set(
                AccountInfo.trophies,
                Math.max(this.world.get(AccountInfo.trophies) - results.trophies, 0)
            );
        }
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
                    {statEls.map((stats, i) => (
                        <div className=" flex flex-col justify-center">
                            {stats.map((stat, j) => (
                                <div
                                    className={
                                        "text-center " +
                                        (i !== 1 &&
                                        parseFloat(stat + "") >=
                                            parseFloat(statEls[2 - i][j] + "")
                                            ? "underline"
                                            : "")
                                    }
                                >
                                    {stat}
                                </div>
                            ))}
                        </div>
                    ))}
                    <div className="flex flex-col justify-center text-center">
                        <span className="text-2xl">
                            {info.winner == "player2" ? "WINNER" : <br />}
                        </span>
                        <img
                            src={Players[info.player2.player].menuPic}
                            className="-scale-x-100"
                        ></img>
                        {info.player2.name}
                    </div>
                </div>
                <div className="bottom-0 flex p-1 bg-base bg-opacity-20 m-2 rounded-md">
                    <AccentButton onclick={() => null}>Play Again</AccentButton>
                    <PrimaryButton
                        className="ml-auto"
                        id="playButton"
                        onclick={() => {
                            this.world.get(StateManager).moveTo(this.menuState);
                            this.world.get(NetworkConnection).close();
                        }}
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
        resume(this.world);
    }
}
