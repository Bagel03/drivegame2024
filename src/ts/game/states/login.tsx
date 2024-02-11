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
import { ServerConnection } from "../../engine/server";
import { showDialog } from "../hud/components/dialogs";
import { Component, Type } from "bagelecs";

export const AccountInfo = Component({
    email: Type.string,
    isGuest: Type.bool,
    username: Type.string,
    trophies: Type.number,
    wins: Type.number,
    totalWins: Type.number,
    class: Type.enum("Freshman", "Sophomore", "Junior", "Senior"),
    classRank: Type.number,
    overallRank: Type.number,
});

window.ai = AccountInfo;

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
                        <div className="">
                            <h1 className="text-center text-white text-3xl mb-2">
                                Please Login
                            </h1>
                            {this.googleBtn}
                        </div>
                    </div>
                    <a
                        className="text-gray-300 underline text-center w-full block absolute bottom-0 pb-3 cursor-pointer"
                        onclick={async () => {
                            this.world.get(StateManager).moveTo(Menu);
                        }}
                    >
                        Continue as Guest
                    </a>
                </MenuBackground>
            </div>
        );
    }

    private async signIn(response: CredentialResponse) {
        // Should show some logging in animation
        const info = await this.world
            .get(ServerConnection)
            .fetch("/accounts/login", {
                searchParams: { jwt: response.credential },
            })
            .catch((e) => {
                console.error(e);
                showDialog({
                    title: "Failed to login",
                    message: "Please try again",
                });
                return { email: "", status: 500 };
            });

        // if (info.status !== 200) {
        //     console.error(info);
        //     showDialog({ title: "Failed to login", message: "Please try again" });
        //     return;
        // }

        this.world.add(
            new AccountInfo({
                email: info.email,
                isGuest: false,
                username: info.username,
                trophies: info.trophies,
                totalWins: info.wins,
                class: info.class,
                classRank: info.classRank,
                overallRank: info.overallRank,
            })
        );

        if (!info.email.endsWith("@catholiccentral.net")) {
            showDialog({
                title: "Non-CC Email",
                message:
                    "You can still play, but none of your stats will count towards leaderboards and prizes. If you are a CC student, please use your CC email to login.",
            });
            this.world.set(AccountInfo.isGuest, true);
        }

        this.world.get(StateManager).moveTo(Menu);
    }
}
