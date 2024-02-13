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
        this.world.set("localPlayer", Players.handcock.name);
        this.world.set("selectedMap", "map1");
        this.world.set("selectedGameMode", "onlinePvP");

        // Just setting it doesn't work, we need to force a reflow
        setTimeout(() => {
            loader.style.opacity = "0";
        });

        setTimeout(() => {
            loader.remove();
        }, 1000);

        this.world.get(StateManager).moveTo(Login);
    }

    async loadAssets() {
        await Assets.load(window.DIST_URL + "/assets/atlas.json");
    }

    initBindings() {
        const input = this.world.get(Input);

        const zero = new Point(0, 0);
        input.addInputMethod("KBM", {
            x: new CombinedBinding({ KeyA: -1, KeyD: 1 }),
            y: new CombinedBinding({ KeyW: -1, KeyS: 1 }),
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

        input.addInputMethod("MOBILE", {
            x: new DirectAnalogBinding("JoystickMovement-X"),
            y: new DirectAnalogBinding("JoystickMovement-Y"),
            aim: new DirectAnalogBinding("JoystickShoot-FireAngle"),
            shoot: new DirectDigitalBinding("JoystickShoot-Fire"),
            ult: new DirectDigitalBinding("KeyE"),
        });
    }

    update(): void {}

    initEndpoints() {}
}
