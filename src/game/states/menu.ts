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
import { showDialog } from "../../engine/rendering/hud/dialogs";
import { MultiplayerGameState } from "./multiplayer";
import { Joystick } from "../hud/components/joystick";

export class Menu extends State<never> {
    private connectionFolder!: FolderApi;

    async onEnter(): Promise<void> {
        const pane = this.world.get(Pane);
        const nc = this.world.get(NetworkConnection);
        await nc.waitForServerConnection;

        this.connectionFolder = pane.addFolder({ title: "Setup Connection" });

        const connectToRemote = { id: "" };

        const localId = this.connectionFolder.addBinding(nc, "id", {
            disabled: true,
            title: "Local ID",
        });
        const remoteId = this.connectionFolder.addBinding(connectToRemote, "id", {
            label: "Remote ID",
        });

        const connect = this.connectionFolder.addButton({
            title: "Connect",
            disabled: true,
        });

        remoteId.on("change", function () {
            connect.disabled = false;
        });

        connect.on("click", async () => {
            try {
                await nc.connect(connectToRemote.id);
            } catch (e) {
                console.error(e);
            }
        });

        nc.waitForConnection.then(() => {
            this.world.get(StateManager).moveTo(MultiplayerGameState, null);
        });
        document.body.append(
            Joystick({ side: "left", id: "Movement" }),
            Joystick({ side: "right", id: "Shoot" })
        );

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
    }

    async onLeave() {
        this.world.get(Pane).remove(this.connectionFolder);
    }

    update() {}
}
