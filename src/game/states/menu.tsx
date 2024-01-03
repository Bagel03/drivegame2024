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

export class Menu extends State<never> {
    private connectionFolder!: FolderApi;

    async onEnter(): Promise<void> {
        const pane = this.world.get(Pane);
        const nc = this.world.get(NetworkConnection);
        document.body.append(this.getHTML());

        await nc.waitForServerConnection;
        await loadAllTextures();

        // this.connectionFolder = pane.addFolder({ title: "Setup Connection" });

        // const connectToRemote = { id: "" };

        // const localId = this.connectionFolder.addBinding(nc, "id", {
        //     disabled: true,
        //     title: "Local ID",
        // });
        // const remoteId = this.connectionFolder.addBinding(connectToRemote, "id", {
        //     label: "Remote ID",
        // });

        nc.waitForConnection.then(() => {
            this.world.get(StateManager).moveTo(MultiplayerGameState, null);
        });

        // nc.newConnectionListeners.add(() => {
        //     this.world.get(StateManager).moveTo(MultiplayerGameState, null);
        //     // startGame(world);
        // });

        // showDialog({
        //     title: "Test Notification",
        //     message:
        //         "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        //     onok: () => {
        //         this.world.get(StateManager).moveTo(Game, null);
        //     },
        // });
        console.log("appended");
    }

    async onLeave() {
        console.log("left");
        // this.world.get(Pane).remove(this.connectionFolder);
        document.querySelector("#menu")?.remove();
    }

    update() {}

    private getHTML() {
        console.log("Called");
        const lastCommitHash = "cddec57";
        const devMode = true;
        const buildTime =
            sessionStorage
                .getItem("buildTime")
                ?.split("%")
                .map((n) => parseFloat(n))[0] ??
            sessionStorage.setItem("buildTime", Date.now().toString()) ??
            Date.now();
        const timeAgo = Math.round((Date.now() - buildTime) / 1000);

        return (
            <div id="menu" className="absolute top-0 left-0">
                {/* background */}
                <div className="bg-gradient-radial from-menuBackgroundAccent to-menuBackground w-screen h-screen">
                    <div className="absolute left-0 bottom-0 m-2 text-white">
                        {devMode ? "Development Build" : "Production build"} @
                        {lastCommitHash} (Built{" "}
                        {timeAgo > 60
                            ? Math.round(timeAgo / 60) + " min"
                            : timeAgo + " seconds "}
                        ago)
                    </div>

                    <div className="absolute right-0 bottom-0 p-3 bg-base bg-opacity-20 m-2 rounded-md">
                        <AccentButton> Friendly Fight </AccentButton>
                        <PrimaryButton onclick={() => this.connectToRemote()}>
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
}
