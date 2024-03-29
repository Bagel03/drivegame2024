import { Entity } from "bagelecs";
import { Input } from "../../engine/input/input";
import {
    AdvancedAngleBinding,
    AnalogBinding,
    AngleBinding,
    AnyBinding,
    CombinedBinding,
    DigitalBinding,
    DirectAnalogBinding,
    DirectDigitalBinding,
} from "../../engine/input/input_bindings";
import { State, StateClass, StateManager } from "../../engine/state_managment";
import { Assets, Container, Point } from "pixi.js";
import { Game } from "./game";
import { Login } from "./login";
import { PlayerSelect } from "./player_select";
import { Menu } from "./menu";
import { Players } from "../players";
import { NetworkConnection } from "../../engine/multiplayer/network";
import { ServerConnection } from "../../engine/server";
import { showDialog } from "../hud/components/dialogs";

declare module "../../engine/input/input" {
    interface Bindings {
        x: AnalogBinding;
        y: AnalogBinding;
        aim: AnalogBinding;
        shoot: DigitalBinding;
        ult: DigitalBinding;
    }
}

export class Preload extends State {
    async onEnter(payload: any, from: StateClass): Promise<void> {
        const loader = document.querySelector<HTMLDivElement>("#preloadScreen")!;

        loader.style.transition = "opacity 1s";
        loader.style.zIndex = "999";
        loader.style.position = "absolute";

        await this.loadAssets();
        this.initBindings();
        await this.world.get(NetworkConnection).waitForServerConnection;

        // Setup resources
        this.world.set("localPlayer", Players.gismondi.name);
        this.world.set("selectedMap", "map1");
        this.world.set("selectedGameMode", "onlinePvP");

        // Just setting it doesn't work, we need to force a reflow
        requestAnimationFrame(() => {
            loader.style.opacity = "0";
        });

        setTimeout(() => {
            loader.remove();
        }, 1000);

        let shouldContinue = true;
        await this.world
            .get(ServerConnection)
            .fetch("/healthcheck", { useBaseUrl: true, leaveRaw: true })
            .catch((e) => {
                console.error("Server not available", e);
                showDialog({
                    title: "Couldn't reach server",
                    message:
                        "School WIFI sometimes blocks the server, if you are connected to the school network, try using your phone's hotspot and reloading. If not, more than likely the servers are crashed, try again later.",
                    hideCancelButton: true,
                });
                shouldContinue = false;
            });

        if (shouldContinue) this.world.get(StateManager).moveTo(Login);

        // const requestFullScreen = () => {
        //     const fullScreenMethod =
        //         document.documentElement.requestFullscreen ||
        //         document.documentElement.webkitRequestFullscreen ||
        //         document.documentElement.mozRequestFullScreen ||
        //         document.documentElement.msRequestFullscreen;
        //     fullScreenMethod();
        // };

        // document.body.addEventListener("pointerdown", requestFullScreen);
    }

    loadImage(url: string) {
        return new Promise<HTMLImageElement>((resolve, reject) => {
            const img = new Image();
            img.src = window.DIST_URL + url;
            img.onload = () => resolve(img);
            img.onerror = reject;
        });
    }

    async loadAssets() {
        await this.loadImage("/assets/Carrier.png");
        await this.loadImage("/assets/Gismo.png");
        await this.loadImage("/assets/background.png");
        await Assets.load({
            src: window.DIST_URL + "/assets/menu.mp3",
            alias: "menu",
        });
        await Assets.load({
            src: window.DIST_URL + "/assets/ingame_music.mp3",
            alias: "ingame",
        });
        await Assets.load(window.DIST_URL + "/assets/atlas.json");
    }

    initBindings() {
        const input = this.world.get(Input);

        const zero = new Point(0, 0);
        input.addInputMethod("KBM", {
            x: new CombinedBinding({ KeyA: -1, KeyD: 1 }),
            y: new CombinedBinding(
                { KeyW: -1, KeyS: 1, Space: -1 },
                { max: 1, min: -1 }
            ),
            // aim: new AdvancedAngleBinding({
            //     originX: () => 0,
            //     // this.world.get(StateManager).currentState === MultiplayerGameState
            //     //     ? this.world.get<Entity>("local_player_entity").get(Container).toGlobal(zero)
            //     //           .x
            //     //     : 0,
            //     originY: () => 0,
            //     // this.world.get(StateManager).currentState === MultiplayerGameState
            //     //     ? this.world.get<Entity>("local_player_entity").get(Container).toGlobal(zero)
            //     //           .y
            //     //     : 0,
            //     targetX: () => 1, // "MouseX",
            //     targetY: () => 1, //"MouseY",
            // }),
            aim: new AdvancedAngleBinding({
                originX: () => {
                    let res =
                        this.world.get(StateManager).currentStateInstance instanceof
                        Game
                            ? this.world
                                  .get<Entity>("local_player_entity")
                                  .get(Container)
                                  .toGlobal(zero).x
                            : 0;
                    return res;
                },
                originY: () => {
                    let res =
                        this.world.get(StateManager).currentStateInstance instanceof
                        Game
                            ? this.world
                                  .get<Entity>("local_player_entity")
                                  .get(Container)
                                  .toGlobal(zero).y
                            : 0;

                    return res;
                },
                targetX: "MouseX",
                targetY: "MouseY",
            }),
            shoot: new AnyBinding("MouseLeft"),
            ult: new AnyBinding("KeyE", "KeyF"),
        });

        input.addInputMethod("GAMEPAD", {
            x: new DirectAnalogBinding("DefaultGamepad-LeftStickX"),
            y: new DirectAnalogBinding("DefaultGamepad-LeftStickY"),
            aim: new AngleBinding(
                "DefaultGamepad-RightStickX",
                "DefaultGamepad-RightStickY"
            ),
            shoot: new DirectDigitalBinding("DefaultGamepad-A"),
            ult: new DirectDigitalBinding("DefaultGamepad-B"),
        });

        const mobileUltButton = (
            <div
                id="Ult"
                className="rounded-2xl aspect-square w-10 fixed flex text-center justify-center text-xl items-center bg-base bg-opacity-30  bottom-0 mb-6 right-28"
            >
                <i className="fa-solid fa-location-crosshairs"></i>
            </div>
        ) as HTMLDivElement;
        this.world.add(mobileUltButton, "mobileUltButton");

        input.attachButtonElement(mobileUltButton);

        input.addInputMethod("MOBILE", {
            x: new DirectAnalogBinding("JoystickMovement-X"),
            y: new DirectAnalogBinding("JoystickMovement-Y"),
            aim: new DirectAnalogBinding("JoystickShoot-FireAngle"),
            shoot: new DirectDigitalBinding("JoystickShoot-Fire"),
            ult: new DirectDigitalBinding("ElementUlt"),
        });
    }

    update(): void {}

    initEndpoints() {}
}
