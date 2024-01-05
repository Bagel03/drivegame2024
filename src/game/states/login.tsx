import type { CredentialResponse } from "google-one-tap";
import {
    ExtractPayload,
    State,
    StateClass,
    StateManager,
} from "../../engine/state_managment";
import { MultiplayerGameState } from "./multiplayer";
import { Menu } from "./menu";

export class Login extends State<void> {
    private googleBtn = (
        <div className="absolute top-0 left-0 z-10"></div>
    ) as HTMLElement;

    onEnter<From extends StateClass<any>>(payload: void, from: From): Promise<void> {
        document.addEventListener("readystatechange", (e) => {
            if (document.readyState !== "complete") return;
            //     document.body.innerHTML = "hello";
            google.accounts.id.initialize({
                client_id:
                    "41009933978-esv02src8bi8167cmqltc4ek5lihc0ao.apps.googleusercontent.com",
                callback: this.signIn.bind(this),
                auto_select: true,
                context: "use",
                itp_support: true,
            });

            // google.accounts.id.prompt((n) => console.log(n.isDisplayed()));
            google.accounts.id.renderButton(this.googleBtn, {
                theme: "filled_blue",
            });
            document.body.appendChild(this.googleBtn);
        });
        return Promise.resolve();
    }

    onLeave<Into extends StateClass<any>>(
        to: Into
    ): Promise<void> | Promise<ExtractPayload<Into>> {
        console.log("left");
        this.googleBtn.remove();
        return Promise.resolve();
    }

    update(): void {}

    private getHTML() {
        return <div></div>;
    }

    private signIn(response: CredentialResponse) {
        const data = JSON.parse(atob(response.credential.split(".")[1]));
        this.world.get(StateManager).moveTo(Menu, null);
        console.log(data);
    }
}
