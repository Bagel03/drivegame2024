import type { CredentialResponse } from "google-one-tap";
import {
    ExtractPayload,
    State,
    StateClass,
    StateManager,
} from "../../engine/state_managment";
import { MenuBackground } from "../hud/background";
import { ServerConnection } from "../../engine/server";
import { showDialog } from "../hud/components/dialogs";
import { Component, Type } from "bagelecs";
import "./fade";
import { Menu } from "./menu";

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

export class Login extends State<{ email: string }> {
    private googleBtn = (<div></div>) as HTMLElement;

    onEnter<From extends StateClass<any>>(
        payload: never,
        from: From
    ): Promise<void> {
        google.accounts.id.initialize({
            client_id:
                "41009933978-esv02src8bi8167cmqltc4ek5lihc0ao.apps.googleusercontent.com",
            callback: (response) => this.signIn({ response }),
            auto_select: true,
            context: "use",
            itp_support: true,
        });

        google.accounts.id.renderButton(this.googleBtn, {
            theme: "filled_blue",
        });

        document.body.append(this.getHTML());

        if (localStorage.getItem("email")) {
            this.signIn({ email: localStorage.getItem("email")! });
        }

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
                            this.world.add(
                                new AccountInfo({
                                    email: "guest@guestemail.com",
                                    isGuest: true,
                                    username:
                                        "Guest" +
                                        Math.floor(Math.random() * 10000)
                                            .toString()
                                            .padStart(5, "0"),
                                    trophies: 0,
                                    totalWins: 0,
                                    class: "Freshman",
                                    classRank: 0,
                                    overallRank: 0,
                                })
                            );
                            await this.world.get(StateManager).fadeTo(Menu);

                            showDialog({
                                title: "Guest Login",
                                message:
                                    "You can still play, but none of your stats will save. If you are a CC student, please use your CC email to login.",
                                oncancel: (e) =>
                                    this.world.get(StateManager).fadeTo(Login),
                            });
                        }}
                    >
                        Continue as Guest
                    </a>
                </MenuBackground>
            </div>
        );
    }

    private getLoggingInHTML() {
        let elements = (
            <div id="login" className="w-full h-full">
                <MenuBackground>
                    <div className="w-full h-full flex justify-center items-center">
                        <div className="">
                            <h1 className="text-center text-white text-3xl mb-2">
                                Logging In...
                            </h1>
                        </div>
                    </div>
                </MenuBackground>
            </div>
        );

        return elements;
    }

    private async signIn({
        response,
        email,
    }: {
        response?: CredentialResponse;
        email?: string;
    }) {
        // Should show some logging in animation
        document.querySelector("#login")?.replaceWith(this.getLoggingInHTML());
        console.log(arguments);
        const searchParams: Record<string, string> = {};
        if (response) {
            searchParams["jwt"] = response.credential;
            console.log("Siging in with", response, response.credential);
        } else if (email) {
            searchParams["email"] = email;
        }

        const info = await this.world
            .get(ServerConnection)
            .fetch("/accounts/login", {
                searchParams,
            })
            .catch((e) => {
                localStorage.removeItem("email");
                showDialog({
                    title: "Failed to login",
                    message: "Please try again",
                });
            });

        if (!info) return;

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
        } else {
            localStorage.setItem("email", info.email);
        }

        this.world.get(StateManager).moveTo(Menu);
    }
}
