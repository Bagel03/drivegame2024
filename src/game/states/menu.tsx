import { Class } from "bagelecs";
import {
    ExtractPayload,
    State,
    StateClass,
    StateManager,
} from "../../engine/state_managment";
import { FolderApi, Pane } from "tweakpane";
import { NetworkConnection } from "../../engine/multiplayer/network";
import { Game } from "./game";
import { DialogPopup, showDialog } from "../hud/components/dialogs";
import { MultiplayerGameState } from "./multiplayer";
import { Joystick } from "../hud/components/joystick";
import { AccentButton, PrimaryButton } from "../hud/components/button";
import { loadAllTextures } from "../setup/load_textures";
import { ChooseGameMode } from "./choose";
import { awaitFrame } from "../../engine/utils";

export class Menu extends State<{
    gameMode: "solo" | "battle" | "co-op";
    map: string;
}> {
    private connectionFolder!: FolderApi;

    async onEnter<From extends StateClass<any>>(
        payload: { gameMode: "solo" | "battle" | "co-op"; map: string },
        from: From
    ): Promise<void> {
        const pane = this.world.get(Pane);
        const nc = this.world.get(NetworkConnection);
        document.body.append(this.getHTML(payload.gameMode));

        await nc.waitForServerConnection;
        await loadAllTextures();
        this.idSpan.textContent = nc.id;

        nc.on("start_game", async (frame: number) => {
            await awaitFrame(this.world, frame);
            this.world.get(StateManager).moveTo(MultiplayerGameState, null);
        });

        // nc.waitForConnection.then(() => {
        //     this.world.get(StateManager).moveTo(MultiplayerGameState, null);
        // });
    }

    async onLeave() {
        console.log("left");
        // this.world.get(Pane).remove(this.connectionFolder);
        document.querySelector("#menu")?.remove();
    }

    update() {}
    private idSpan = (<span></span>);
    private getHTML(gameMode: "solo" | "battle" | "co-op" = "solo") {
        console.log("Called");
        const lastCommitHash = "cddec57";
        const devMode = true;
        const buildTime = 1704911624295;
        const timeAgo = Math.round((Date.now() - buildTime) / 1000);

        return (
            <div id="menu" className="absolute top-0 left-0  w-full h-full">
                {/* background */}
                <div className="bg-gradient-radial from-menuBackgroundAccent to-menuBackground w-full h-full">
                    <div className="absolute left-0 bottom-0 m-2 text-white">
                        ID: {this.idSpan}
                        {" - "}
                        {devMode ? "Development Build" : "Production build"} @
                        {lastCommitHash} (Built {Math.round(timeAgo / 60) + " min "}
                        ago)
                    </div>

                    <div className="absolute right-0 top-0 m-2 text-white">
                        <PrimaryButton onclick={() => this.connectToRemote()}>
                            Invite to party
                        </PrimaryButton>
                    </div>

                    <div className="absolute right-0 bottom-0 p-3 bg-base bg-opacity-20 m-2 rounded-md">
                        <AccentButton
                            onclick={() =>
                                this.world
                                    .get(StateManager)
                                    .moveTo(ChooseGameMode, null)
                            }
                        >
                            {" " + gameMode + " "}
                        </AccentButton>
                        <PrimaryButton onclick={() => this.queueGameStart()}>
                            PLAY
                        </PrimaryButton>
                    </div>
                </div>
            </div>
        );
    }

    private connectToRemote() {
        const input = (
            <input
                type="text"
                /*pattern="[a-zA-z]{5}"*/ className="capitalize"
            ></input>
        ) as HTMLInputElement;
        const dialog = (
            <DialogPopup
                title="Enter Remote ID"
                message={`The remote ID should be 5 capital letters. Your ID is ${
                    this.world.get(NetworkConnection).id
                }`}
                onok={
                    () => this.world.get(NetworkConnection).connect(input.value)
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

    private async queueGameStart() {
        const startFrame = this.world.get(NetworkConnection).framesConnected + 10;

        this.world.get(NetworkConnection).send("start_game", startFrame);
        await awaitFrame(this.world, startFrame);
        this.world.get(StateManager).moveTo(MultiplayerGameState, null);
    }
}
