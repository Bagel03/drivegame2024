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
import { GameOverState } from "./game_over";
import { Container } from "pixi.js";
import { With } from "bagelecs";

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
    }

    // private readonly hud = (
    //     <div className="z-10 absolute top-0 left-0 w-full h-full"></div>
    // ) as HTMLDivElement;

    public hud: {
        element: HTMLDivElement;
        updatePlayer1HealthBar: (percent: number) => void;
        updatePlayer2HealthBar: (percent: number) => void;
        timer: HTMLDivElement;
        joysticks: HTMLDivElement[];
    } = {} as any;

    // Setup HUD
    loadHUD() {
        this.hud.element = (
            <div className="z-10 absolute top-0 left-0 w-full h-full"></div>
        ) as HTMLDivElement;

        document.body.appendChild(this.hud.element);

        const player1Handle: {
            update?: ((percent: number) => void) | undefined;
        } = {};
        const player2Handle: {
            update?: ((percent: number) => void) | undefined;
        } = {};

        this.hud.timer = (<div className="">0:00</div>) as HTMLDivElement;

        this.hud.element.append(
            <div className="top-0 w-full flex justify-between">
                <div className="text-left">
                    Player 1
                    <HealthBar
                        initialPercent={50}
                        className="w-52 h-2"
                        handle={player1Handle}
                    ></HealthBar>
                </div>
                {this.hud.timer}
                <div className="text-right">
                    Player 2
                    <HealthBar
                        initialPercent={50}
                        className="w-52 h-2"
                        growLeft
                        handle={player2Handle}
                    ></HealthBar>
                </div>
            </div>
        );

        this.hud.updatePlayer1HealthBar = player1Handle.update!;
        this.hud.updatePlayer2HealthBar = player2Handle.update!;
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
    }

    playerInfo() {
        const handle = {};
        return (
            <div>
                <div>
                    <i className="fa-solid fa-user"></i>
                    <span>Player 1</span>
                </div>
                <HealthBar handle={handle} initialPercent={0}></HealthBar>
            </div>
        );
    }

    update() {}
    async onLeave(to: StateClass<any>) {
        if (to === GameOverState) {
            disablePixiRendering(this.world, false);
        } else {
            disablePixiRendering(this.world, true);
        }

        this.world.query(With(Container)).forEach((ent) => this.world.destroy(ent));
        this.hud.element.remove();
    }
}
