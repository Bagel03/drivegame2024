import { LOGGED_COMPONENT_STORAGE_BUFFER_SIZE } from "bagelecs";
import { State, StateClass, StateManager } from "../../engine/state_managment";
import { NetworkConnection } from "../../engine/multiplayer/network";
import { DialogPopup, KEEP_OPEN, showDialog } from "../hud/components/dialogs";
import { MultiplayerGame } from "./multiplayer";
import { AccentButton, PrimaryButton } from "../hud/components/button";
import { ChooseGameMode } from "./choose_game";
import { awaitFrame } from "../../engine/utils";
import { SoloGame } from "./solo";
import { MenuBackground } from "../hud/background";
import { PlayerSelect } from "./player_select";
import { Players } from "../players";
import { GameModes } from "../game_modes";
import { ServerConnection } from "../../engine/server";
import { AccountInfo } from "./login";
import { Levels, totalWinsToLevel } from "../levels";

interface MenuPayload {}

export class Menu extends State<MenuPayload> {
    async onEnter<From extends StateClass<any>>(
        payload: MenuPayload,
        from: From
    ): Promise<void> {
        this.setupEndpoints();
        const nc = this.world.get(NetworkConnection);

        document.body.append(this.getHTML());

        // POST
        nc.post("playerChange");

        // await nc.waitForServerConnection;

        // nc.waitForConnection.then(() => {
        //     this.world.get(StateManager).moveTo(MultiplayerGameState, null);
        // });
    }

    private async fetchServerInfo() {
        const serverResponse = await fetch("");
        const data = await serverResponse.json();
        console.log(data);
    }

    async onLeave() {
        document.querySelector("#menu")?.remove();
        this.eventListenerIds.forEach(([e, id]) =>
            this.world.get(NetworkConnection).removeEventListener(e, id)
        );
    }

    private getHTML() {
        const lastCommitHash = "cddec57";
        const devMode = true;
        const buildTime = 1707187970073;
        const timeAgo = Math.round((Date.now() - buildTime) / 1000);

        const { level, winsIntoLevel } = totalWinsToLevel(
            this.world.get(AccountInfo.totalWins)
        );
        const levelTotalWins = Levels[level].wins;

        const text = winsIntoLevel + "/" + Levels[level].wins + " Wins";
        console.log(text);

        return (
            <div id="menu" className="absolute top-0 left-0  w-full h-full">
                <MenuBackground>
                    {/* Top */}
                    <div className="absolute top-0 left-0 p-2 flex text-white bg-menuBackground bg-opacity-50 rounded-br-md w-auto h-auto">
                        <div className="h-12 w-60 bg-menuBackgroundAccent rounded-md pt-1">
                            <div className="w-full pl-4 pr-4 text-center">
                                {this.world.get(AccountInfo.username)}
                                {": "}
                                <span className="text-yellow-400  w-auto">
                                    🏆{this.world.get(AccountInfo.trophies)}
                                </span>
                            </div>

                            <div className="flex">
                                <div className="w-3/4 h-4 ml-2 bg-menuBackground rounded-full flex">
                                    <div
                                        className="h-full bg-primary rounded-full brightness-150 text-center justify-center flex items-center text-sm text-black"
                                        style={{
                                            width:
                                                (100 * winsIntoLevel) /
                                                    Levels[level].wins +
                                                "%",
                                        }}
                                    >
                                        {winsIntoLevel / levelTotalWins > 0.5
                                            ? text
                                            : ""}
                                    </div>
                                    <div className="h-full flex-grow text-white text-center justify-center flex align-middle items-center text-sm">
                                        {winsIntoLevel / levelTotalWins < 0.5
                                            ? text
                                            : ""}
                                    </div>
                                </div>
                                <div className="flex items-center h-4 pl-2">
                                    Lvl {level + 1}
                                </div>
                            </div>
                        </div>

                        {this.world.get(AccountInfo.isGuest) ? (
                            ""
                        ) : (
                            <div className="ml-2 h-12 w-20 bg-menuBackgroundAccent rounded-md text-center flex justify-center flex-col">
                                <h1 className="text-xl">
                                    #{this.world.get(AccountInfo.classRank)}
                                </h1>
                                <h5 className="text-sm">
                                    {this.world.get(AccountInfo.class)}
                                </h5>
                            </div>
                        )}
                    </div>
                    <div className="absolute left-0 bottom-0 m-2 text-white">
                        {devMode ? "Development Build " : "Production build "} @
                        {lastCommitHash + " "} ({"Built "}
                        {Math.round(timeAgo / 60) + " min "}
                        ago)
                    </div>

                    {/* Shop */}
                    <div
                        className="absolute pr-2 w-16 h-52 left-0 top-[50%] transform -translate-y-1/2 text-white bg-menuBackground rounded-tr-md rounded-br-md
                     bg-opacity-50 flex items-center justify-center flex-col"
                    >
                        {[
                            {
                                icon: "fa-solid fa-cart-shopping",
                                text: "Shop",
                                onclick: () => {
                                    showDialog(
                                        <DialogPopup
                                            title="Vote for shop items"
                                            message="The shop is coming soon, go <here> to cast your vote for which items we should add"
                                            hideCancelButton
                                        ></DialogPopup>
                                    );
                                },
                            },
                            {
                                icon: "fa-regular fa-calendar",
                                text: "News",
                                onclick: () => {
                                    showDialog(
                                        <DialogPopup
                                            title="News"
                                            message="<h1>Drive Game Released! </h1><br>Go check out all the current characters, and play online with your friends!"
                                            hideCancelButton
                                        ></DialogPopup>
                                    );
                                },
                            },
                            {
                                icon: "fa-solid fa-users",
                                text: "Players",
                                onclick: () =>
                                    this.world
                                        .get(StateManager)
                                        .fadeTo(PlayerSelect),
                            },
                        ].map(({ icon, text, onclick }) => (
                            <div
                                onclick={onclick}
                                className="w-full aspect-square text-center bg-menuBackgroundAccent rounded-md bg-opacity-75 pt-2 m-auto hover:brightness-90 cursor-pointer"
                            >
                                <i className={`${icon} fa-xl`}></i>
                                <br></br>
                                {text}
                            </div>
                        ))}
                    </div>

                    <div className="absolute top-0 right-0 bg-menuBackground bg-opacity-50 p-2 rounded-bl-md text-white flex items-center justify-center m-2">
                        <div className="bg-menuBackgroundAccent rounded-md h-10 w-10 flex items-center justify-center cursor-not-allowed">
                            <i className="fa-solid fa-bars fa-xl"></i>
                        </div>
                        {/* <div className="bg-menuBackgroundAccent rounded-md h-10 w-10 m-auto text-center">
                            <i className="fa-solid fa-bars fa-xl"></i>
                        </div> */}
                    </div>

                    {/* Players */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex justify-center align-middle items-center">
                        <img
                            src={
                                Players[this.world.get("localPlayer") as "carrier"]
                                    .menuPic
                            }
                            className="h-48"
                        />
                        {this.world.get(NetworkConnection).isConnected ? (
                            <img
                                id="remotePlayer"
                                src={
                                    Players[
                                        this.world.get("remotePlayer") as "carrier"
                                    ].menuPic
                                }
                                className="h-36"
                            />
                        ) : (
                            <div
                                id="connectToRemote"
                                onclick={() => {
                                    // Connect to remote
                                    this.connectToRemote();
                                }}
                            >
                                <i className="fa-solid fa-user-plus fa-2x opacity-75 ml-8 hover:opacity-100"></i>
                            </div>
                        )}
                    </div>

                    {/* Play Button */}
                    <div className="absolute right-0 bottom-0 p-1 bg-base bg-opacity-20 m-2 rounded-md">
                        <AccentButton
                            onclick={() =>
                                this.world
                                    .get(StateManager)
                                    .fadeTo(ChooseGameMode, null)
                            }
                            id="gameModeButton"
                        >
                            {
                                GameModes[
                                    this.world.get("selectedGameMode") as "solo"
                                ].name
                            }
                        </AccentButton>
                        <PrimaryButton
                            id="playButton"
                            onclick={() => {
                                switch (this.world.get("selectedGameMode")) {
                                    case "localPvP":
                                        this.queueMultiplayerGameStart();
                                        break;
                                    case "onlinePvP":
                                        this.enterQueue();
                                        break;
                                    case "co-op":
                                        this.queueMultiplayerGameStart();
                                        break;
                                    case "solo":
                                        this.world
                                            .get(StateManager)
                                            .fadeTo(SoloGame);
                                        break;
                                }
                            }}
                        >
                            PLAY
                        </PrimaryButton>
                    </div>
                </MenuBackground>
            </div>
        );
    }

    private connectToRemote() {
        const input = (
            <input
                type="text"
                pattern="[0-9]{5}"
                className="uppercase mt-1 w-1/2 m-auto text-center bg-secondary text-xl text-white invalid:text-gray-500"
                placeholder="XXXXX"
            ></input>
        ) as HTMLInputElement;
        const dialog = (
            <DialogPopup
                title="Enter Remote ID"
                message={`The remote ID should be 5 capital letters. Your ID is ${
                    this.world.get(NetworkConnection).id
                }`}
                onok={
                    async () => {
                        const remoteId = input.value.toUpperCase();
                        try {
                            if (!input.checkValidity()) {
                                // Play some sound
                                return KEEP_OPEN;
                            }
                            const nc = this.world.get(NetworkConnection);
                            await nc.connect(remoteId);
                            const username = await nc.fetch("username");
                            this.world.add(username, "remoteUser");
                            const player = await nc.fetch("currentPlayer");
                            console.log("Player", player);

                            this.world.add("remotePlayer", player);
                            document
                                .querySelector("#connectToRemote")
                                ?.replaceWith(
                                    <img id="remotePlayer" className="h-36" />
                                );
                            this.world.set("selectedGameMode", "localPvP");
                            nc.post("gameModeChange");

                            document.querySelector("#gameModeButton")!.innerHTML =
                                GameModes[
                                    this.world.get("selectedGameMode") as "solo"
                                ].name;
                        } catch (e) {
                            showDialog(
                                <DialogPopup
                                    title="Failed To Connect"
                                    message={(e as Error).message}
                                    hideCancelButton
                                ></DialogPopup>
                            );
                        }

                        // Play some sound effect or something
                    }
                    // .then(() =>
                    //     this.world
                    //         .get(StateManager)
                    //         .moveTo(MultiplayerGameState, null)
                    // )
                }
            >
                {input}
            </DialogPopup>
        );

        showDialog(dialog);
    }

    private enterQueue() {
        return new Promise<void>((res, rej) => {
            const play = document.querySelector<HTMLButtonElement>("#playButton")!;

            this.world
                .get(ServerConnection)
                .fetch("/matchmaking/enterQueue", {
                    searchParams: {
                        id: this.world.get(NetworkConnection).id,
                    },
                })
                .then(async (serverRes) => {
                    const { remoteId, isHost } = serverRes;
                    if (!isHost) return res();

                    // Connect to the other guy
                    play.innerHTML = "Establishing Connection";
                    const nc = this.world.get(NetworkConnection);
                    try {
                        await nc.connect(remoteId);
                        this.queueMultiplayerGameStart();
                    } catch (e) {
                        showDialog({
                            title: "Matchmaking error",
                            message: "Failed to establish connection",
                            hideCancelButton: true,
                        });
                        nc.close();
                    }
                    res();
                });

            this.world.add(true, "inQueue");
            play.innerHTML = "In queue (";
            const span = (<span>0</span>) as HTMLSpanElement;
            play.append(span, "s)");
            let seconds = 0;

            setInterval(() => {
                seconds++;
                span.innerHTML = seconds.toString();
            }, 1000);
        });
    }

    private async queueMultiplayerGameStart() {
        const startFrame =
            this.world.get(NetworkConnection).framesConnected +
            LOGGED_COMPONENT_STORAGE_BUFFER_SIZE +
            10;

        this.world.get(NetworkConnection).send("start_game", startFrame);
        await awaitFrame(this.world, startFrame);
        this.world.get(StateManager).fadeTo(MultiplayerGame);
    }

    static alreadySetupEndpoints = false;

    private eventListenerIds: [name: "connect" | "close", number][] = [];

    private setupEndpoints() {
        const nc = this.world.get(NetworkConnection);

        // Add the transient stuff (ie. disconnect)

        this.eventListenerIds.push(
            ["connect", nc.addEventListener("connect", () => {})],
            [
                "connect",
                nc.addEventListener("close", () => {
                    document.querySelector("#remotePlayer")?.replaceWith(
                        <div
                            id="connectToRemote"
                            onclick={() => this.connectToRemote()}
                        >
                            <i className="fa-solid fa-user-plus fa-2x opacity-75 ml-8 hover:opacity-100"></i>
                        </div>
                    );
                }),
            ]
        );

        if (Menu.alreadySetupEndpoints) return;
        Menu.alreadySetupEndpoints = true;

        nc.addEndpoint("username", () => {
            console.log("Sending username");
            return this.world.get(AccountInfo.username);
        });

        nc.addEndpoint("currentPlayer", () => {
            console.log("sending current player");
            return this.world.get("localPlayer");
        });
        nc.addEndpoint("playerChange", async () => {
            const player = await nc.fetch("currentPlayer");
            this.world.set("remotePlayer", player);
            document
                .querySelector("#connectToRemote")
                ?.replaceWith(<img id="remotePlayer" className="h-36" />);
            document
                .querySelector("#remotePlayer")
                ?.setAttribute("src", Players[player as "carrier"].menuPic);
        });
        nc.addEventListener("connect", async () => {
            nc.post("playerChange");

            this.world.set("remotePlayer", await nc.fetch("currentPlayer"));
            this.world.set("remoteUser", await nc.fetch("username"));
        });
        nc.addEndpoint("currentGameMode", () => {
            return this.world.get("selectedGameMode");
        });
        nc.addEndpoint("gameModeChange", async () => {
            const mode = (await nc.fetch("currentGameMode")) as "solo";
            this.world.set("selectedGameMode", mode);
            document.querySelector("#gameModeButton")!.innerHTML =
                GameModes[mode].name;
        });
        // nc.on("")

        nc.on("start_game", async (frame: number) => {
            await awaitFrame(this.world, frame);
            this.world.get(StateManager).fadeTo(MultiplayerGame);
        });
    }
}

declare global {
    interface NetworkFetchPoints {
        currentPlayer: string;
        playerChange: void;
        currentGameMode: string;
        gameModeChange: void;
        username: string;
    }
}
