import { Game } from "./game";
import { Graphics, Sprite, Texture } from "pixi.js";
import { NetworkConnection, PeerId } from "../../engine/multiplayer/network";
import { AnimatedSprite } from "../../engine/rendering/animation";
import { GraphicsEnt } from "../../engine/rendering/blueprints/graphics";
import { StateClass, StateManager } from "../../engine/state_managment";
import { CollisionHitbox } from "../components/collision";
import { PlayerInfo } from "../components/player_info";
import { Velocity } from "../components/velocity";
import { Wall } from "../blueprints/wall";
import { Joystick } from "../hud/components/joystick";
import "./preload";
import { RollbackManager } from "../../engine/multiplayer/rollback";
import { PlayerDescriptor, Players } from "../players";
import { Entity, Resource, Type, World } from "bagelecs";
import { Funds } from "../components/funds";
import { GameOverState } from "./game_over";
import { DESIRED_FRAME_TIME } from "../../engine/loop";
import { Script } from "../../engine/script";
import { MultiplayerInput } from "../../engine/multiplayer/multiplayer_input";

export const Countdown = Resource(Type.number.logged());
export const MatchTimer = Resource(Type.number.logged());
console.log("Coutndown is", Countdown.getId());

console.log("Game is", Game);

export class MultiplayerGame extends Game {
    player1!: Entity;
    player2!: Entity;
    hasLoadedHud!: boolean;

    async onEnter<From extends StateClass<any>>(
        payload: never,
        from: From
    ): Promise<void> {
        await super.onEnter(payload, from);
        // this.world.disable(MovementSystem);

        const player1 = GraphicsEnt(
            48,
            32,
            { fillStyle: "blue" },
            "drawRect",
            0,
            0,
            16,
            16
        );
        this.player1 = player1;
        const player2 = GraphicsEnt(
            256 - 48 - 16,
            32,
            { fillStyle: "red" },
            "drawRect",
            0,
            0,
            16,
            16
        );
        this.player2 = player2;

        for (const player of [player1, player2]) {
            player.remove(Graphics);
            console.log(player.has(Graphics), player.has(Sprite));
            player.add(new Sprite(Texture.from("walk_00.png")));
            player.get(Sprite).width = 40;
            player.get(Sprite).height = 32;
            player.add(new Velocity({ x: 0, y: 0 }));
            player.add(new Funds(PlayerInfo.globals.targetFunds / 3));
            // player.addScript(LaserPlayer);
            player.add(
                new PlayerInfo({
                    canJump: true,
                    heath: 100,
                    shootCooldown: 0,
                    ultPercent: 0,
                    ultTimeLeft: 0,
                })
            );
            player.add(new CollisionHitbox({ x: 32, y: 32 }));
            player.add(
                new AnimatedSprite({
                    spriteName: "walk",
                    currentFrame: 0,
                    thisFrameElapsed: 0,
                    thisFrameTotal: 15,
                    frameCount: 8,
                })
            );
        }

        player1.add(new PeerId(this.world.get(NetworkConnection).player1));
        player2.add(new PeerId(this.world.get(NetworkConnection).player2));

        if (
            this.world.get(NetworkConnection).id ===
            this.world.get(NetworkConnection).player1
        ) {
            this.world.add(player1, "local_player_entity");
            this.world.add(player2, "remote_player_entity");
        } else {
            this.world.add(player1, "remote_player_entity");
            this.world.add(player2, "local_player_entity");
        }

        this.world
            .get<Entity>("remote_player_entity")
            .addScript(
                Players[this.world.get<"carrier">("remotePlayer")].playerScript
            );
        this.world
            .get<Entity>("local_player_entity")
            .addScript(
                Players[this.world.get<"carrier">("localPlayer")].playerScript
            );
        // player1.remove(Graphics);
        // player1.add(new Sprite(Texture.from("walk_00.png")));
        // player1.get(Sprite).width = 40;
        // player1.get(Sprite).height = 32;
        // player1.addScript(MrCarrierPlayer);
        // player1.add(new Velocity({ x: 0, y: 0 }));
        // player1.add(
        //     new PlayerInfo({
        //         canJump: true,
        //         heath: 100,
        //         shootCooldown: 0,
        //         ultPercent: 0,
        //         ultTimeLeft: 0,
        //     })
        // );
        // player1.add(new CollisionHitbox({ x: 32, y: 32 }));
        // // Look into removing this
        // player1.add(new PeerId(this.world.get(NetworkConnection).id));
        // player1.add(
        //     new AnimatedSprite({
        //         spriteName: "walk",
        //         currentFrame: 0,
        //         thisFrameElapsed: 0, // Note that both of these are in frames, not ms or seconds
        //         thisFrameTotal: 15,
        //         frameCount: 8,
        //     })
        // );

        // this.world.add(player1, "local_player_entity");

        Wall(0, 230, 256, 20, "red");
        Wall(50, 170, 50, 10, "red");
        Wall(256 - 50 - 50, 170, 50, 10, "red");

        const joysticks = (
            <>
                <Joystick id="Movement" side="left"></Joystick>
                <Joystick id="Shoot" side="right"></Joystick>
            </>
        ) as any as HTMLElement[];
        this.hud.element.append(...joysticks);

        // Wait 1 seconds before starting the input sync
        this.world.add(new Countdown(3));
        const countdownScript: Script<World> = function () {
            this.set(Countdown.id, this.get(Countdown) - DESIRED_FRAME_TIME / 1000);

            if (this.get(Countdown) <= 0) {
                this.get(RollbackManager).enableRollback();
                this.add(new MatchTimer(0));
                this.addScript(() =>
                    this.set(
                        MatchTimer.id,
                        this.get(MatchTimer) + DESIRED_FRAME_TIME / 1000
                    )
                );
                this.removeScript(countdownScript);
            }
        };
        this.world.addScript(countdownScript);

        this.hasLoadedHud = true;
    }

    update(): void {
        // Update the HUD

        if (!this.hasLoadedHud) return;

        console.log("Updating");
        const secondsElapsed = this.world.has(MatchTimer)
            ? this.world.get(MatchTimer)
            : 0;

        const minElapsed = Math.floor(secondsElapsed / 60);
        this.hud.timer.innerHTML =
            minElapsed.toString().padStart(2, "0") +
            ":" +
            (secondsElapsed % 60).toFixed(0).padStart(2, "0");

        this.hud.updatePlayer1HealthBar(
            (this.player1.get(Funds) * 100) / PlayerInfo.globals.targetFunds
        );
        this.hud.updatePlayer2HealthBar(
            (this.player2.get(Funds) * 100) / PlayerInfo.globals.targetFunds
        );

        if (
            this.player1.get(Funds) >= PlayerInfo.globals.targetFunds ||
            this.player2.get(Funds) >= PlayerInfo.globals.targetFunds
        ) {
            this.world.get(StateManager).moveTo(GameOverState);
        }
    }

    async onLeave(to: StateClass<any>): Promise<void> {
        this.world.remove(MatchTimer);
        this.world.remove(Countdown);
        this.world.clearScripts();
        this.world.get(RollbackManager).disableRollback();
        const mi = this.world.get(MultiplayerInput);
        mi.knownFutureInputs.clear();
        //@ts-ignore
        mi.buffers = {};
        mi.ready = false;
        mi.init();
        // this.world.get(MultiplayerInput).knownFutureInputs.clear();
        // this.world.get(MultiplayerInput).buffers = {};
        await super.onLeave(to);
    }
}
