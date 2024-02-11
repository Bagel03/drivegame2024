import { enableInspect, monitor } from "../../editor/inspect";
import { State, StateClass } from "../../engine/state_managment";
import { RemoveDeadEntities } from "../systems/timed";
import { enablePixiRendering } from "../../engine/rendering/plugin";
import { MovementSystem } from "../systems/movement";
import { CollisionSystem } from "../systems/collision";
import { startMultiplayerInput } from "../../engine/multiplayer/multiplayer_input";
import { HealthBar } from "../hud/components/health";
import { InputMethod } from "../../engine/input/input";
import { Joystick } from "../hud/components/joystick";

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

        this.loadHUD();
    }

    private readonly hud = (
        <div className="z-10 absolute top-0 left-0 w-full h-full"></div>
    ) as HTMLDivElement;

    // Setup HUD
    loadHUD() {
        document.body.appendChild(this.hud);

        const player1Handle = {};
        const player2Handle = {};

        const timer = (<div className="">0:00</div>) as HTMLDivElement;

        this.hud.append(
            <div className="top-0 w-full flex justify-between">
                <div className="">
                    <HealthBar
                        initialPercent={50}
                        className="w-52 h-2"
                        handle={player1Handle}
                    ></HealthBar>
                </div>
                {timer}
                <div className="">
                    <HealthBar
                        initialPercent={50}
                        className="w-52 h-2"
                        growLeft
                        handle={player2Handle}
                    ></HealthBar>
                </div>
            </div>
        );

        window.handles = { player1Handle, player2Handle };

        if (InputMethod.isMobile()) {
            this.hud.append(
                <Joystick id="Movement" side="left"></Joystick>,
                <Joystick id="Shoot" side="right"></Joystick>
            );
        }

        let time = 0;
        setInterval(() => {
            time += 1;
            timer.innerText = `${Math.floor(time / 60)}:${(time % 60)
                .toString()
                .padStart(2, "0")}`;
        }, 1000);
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
    async onLeave() {}
}
