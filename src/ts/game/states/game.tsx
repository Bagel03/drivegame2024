import { State, StateClass } from "../../engine/state_managment";
import { RemoveDeadEntities } from "../systems/timed";
import {
    disablePixiRendering,
    enablePixiRendering,
} from "../../engine/rendering/plugin";
import { MovementSystem } from "../systems/movement";
import { CollisionSystem } from "../systems/collision";
import { startMultiplayerInput } from "../../engine/multiplayer/multiplayer_input";
import { HealthBar } from "../hud/components/health";
import { InputMethod } from "../../engine/input/input";
import { Joystick } from "../hud/components/joystick";
import { PaymentSystem } from "../systems/payment";
// import { GameOverState } from "./game_over";
import { Container } from "pixi.js";
import { With } from "bagelecs";
import type { GameOverState } from "./game_over";

export class Game extends State<never> {
    async onEnter<From extends StateClass<any>>(
        payload: never,
        from: From
    ): Promise<void> {
        enablePixiRendering(this.world);
        startMultiplayerInput(this.world);
        // enableInspect(this.world);

        this.world.addSystem(MovementSystem);
        this.world.addSystem(MovementSystem, "rollback");

        this.world.addSystem(RemoveDeadEntities);
        this.world.addSystem(RemoveDeadEntities, "rollback");

        this.world.addSystem(CollisionSystem);
        this.world.addSystem(CollisionSystem, "rollback");

        this.world.addSystem(PaymentSystem);
        this.world.addSystem(PaymentSystem, "rollback");

        this.loadHUD();
        import("./game_over").then((m) => (this.gameOver = m.GameOverState));
    }

    public gameOver!: typeof GameOverState;

    // private readonly hud = (
    //     <div className="z-10 absolute top-0 left-0 w-full h-full"></div>
    // ) as HTMLDivElement;

    public hud: {
        element: HTMLDivElement;
        updatePlayer1HealthBar: (percent: number) => void;
        updatePlayer2HealthBar: (percent: number) => void;

        updatePlayer1UltBar: (percent: number) => void;
        updatePlayer2UltBar: (percent: number) => void;
        timer: HTMLDivElement;
        joysticks: HTMLDivElement[];
    } = {} as any;

    // Setup HUD
    loadHUD() {
        this.hud.element = (
            <div className="z-10 absolute top-0 left-0 w-full h-full"></div>
        ) as HTMLDivElement;

        document.body.appendChild(this.hud.element);

        type HealthBarHandle = {
            update?: ((percent: number) => void) | undefined;
        };
        const player1Handle: HealthBarHandle = {};
        const player2Handle: HealthBarHandle = {};
        const player1Ult: HealthBarHandle = {};
        const player2Ult: HealthBarHandle = {};

        this.hud.timer = (<div className="">0:00</div>) as HTMLDivElement;

        this.hud.element.append(
            <div className="top-0 w-full flex justify-between pl-3 pr-3">
                <div className="text-left pl-1">
                    <span className="pl-2">Player 2</span>
                    <HealthBar
                        initialPercent={0}
                        className="w-52 h-2"
                        handle={player1Handle}
                        color="bg-lime-500"
                    ></HealthBar>
                    <HealthBar
                        initialPercent={0}
                        className="w-52 h-2 pt-1"
                        handle={player1Ult}
                        color="bg-indigo-700"
                    ></HealthBar>
                </div>
                <div className="text-xl pt-2">{this.hud.timer}</div>
                <div className="text-right ">
                    <span className="rl-2">Player 2</span>
                    <HealthBar
                        color="bg-lime-500"
                        initialPercent={0}
                        className="w-52 h-2"
                        growLeft
                        handle={player2Handle}
                    ></HealthBar>
                    <HealthBar
                        color="bg-indigo-700"
                        initialPercent={0}
                        className="w-52 h-2 pt-1"
                        growLeft
                        handle={player2Ult}
                    ></HealthBar>
                </div>
            </div>
        );

        this.hud.updatePlayer1HealthBar = player1Handle.update!;
        this.hud.updatePlayer2HealthBar = player2Handle.update!;
        this.hud.updatePlayer1UltBar = player1Ult.update!;
        this.hud.updatePlayer2UltBar = player2Ult.update!;
        // window.handles = { player1Handle, player2Handle };

        if (InputMethod.isMobile()) {
            this.hud.joysticks = [
                <Joystick id="Movement" side="left"></Joystick>,
                <Joystick id="Shoot" side="right"></Joystick>,
            ] as HTMLDivElement[];
        } else {
            this.hud.joysticks = [];
        }

        this.hud.element.append(...this.hud.joysticks);
        if (InputMethod.isMobile()) {
            this.hud.element.append(
                this.world.get<HTMLDivElement>("mobileUltButton")
            );
        }
    }

    update() {}
    async onLeave(to: StateClass<any>) {
        if (to === this.gameOver) {
            disablePixiRendering(this.world, false);
        } else {
            disablePixiRendering(this.world, true);
        }

        this.world.query(With(Container)).forEach((ent) => this.world.destroy(ent));
        this.hud.element.remove();
    }
}

<div className="h-16"></div>;
