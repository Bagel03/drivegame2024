import type { CredentialResponse } from "google-one-tap";
import {
    ExtractPayload,
    State,
    StateClass,
    StateManager,
} from "../../engine/state_managment";
import { MultiplayerGame } from "./multiplayer";
import { Menu } from "./menu";
import { MenuBackground } from "../hud/background";

export class Login extends State<never> {
    private googleBtn = (<div></div>) as HTMLElement;

    onEnter<From extends StateClass<any>>(
        payload: never,
        from: From
    ): Promise<void> {
        google.accounts.id.initialize({
            client_id:
                "41009933978-esv02src8bi8167cmqltc4ek5lihc0ao.apps.googleusercontent.com",
            callback: this.signIn.bind(this),
            auto_select: true,
            context: "use",
            itp_support: true,
        });

        google.accounts.id.renderButton(this.googleBtn, {
            theme: "filled_blue",
        });

        console.log("Filled bubble");

        document.body.append(this.getHTML());
        return Promise.resolve();
    }

    onLeave<Into extends StateClass<any>>(
        to: Into
    ): Promise<void> | Promise<ExtractPayload<Into>> {
        document.querySelector("#login")?.remove();
        console.log("Removed it");

        return Promise.resolve();
    }

    update(): void {}

    private getHTML() {
        return (
            <div id="login" className="w-full h-full">
                <MenuBackground>
                    <div className="w-full h-full flex justify-center items-center">
                        <div className="w-72 h-32">
                            <h1 className="text-center text-white text-3xl mb-2">
                                Please Login
                            </h1>
                            {this.googleBtn}
                        </div>
                    </div>
                    <a
                        className="text-gray-300 underline text-center w-full block absolute bottom-0 pb-3 cursor-pointer"
                        onclick={() => {
                            this.world
                                .get(StateManager)
                                .moveTo(Menu, { gameMode: "solo", map: "test" });
                        }}
                    >
                        Continue as Guest
                    </a>
                </MenuBackground>
            </div>
        );
    }

    private signIn(response: CredentialResponse) {
        const data = JSON.parse(atob(response.credential.split(".")[1]));
        this.world.get(StateManager).moveTo(Menu, { gameMode: "solo", map: "test" });
        console.log(data);
    }
}
