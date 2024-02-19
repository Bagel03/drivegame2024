import { Game } from "./game";
import { NetworkConnection, PeerId } from "../../engine/multiplayer/network";
import { StateClass, StateManager } from "../../engine/state_managment";
import { PlayerInfo } from "../components/player_info";
import { Wall } from "../blueprints/wall";
import "./preload";
import { RollbackManager } from "../../engine/multiplayer/rollback";
import { Players } from "../players";
import { Entity, Resource, Type, World } from "bagelecs";
import { Funds } from "../components/funds";
import { GameOverState } from "./game_over";
import { DESIRED_FRAME_TIME } from "../../engine/loop";
import { Script } from "../../engine/script";
import { MultiplayerInput } from "../../engine/multiplayer/multiplayer_input";
import { Player } from "../blueprints/player";
import { MatchInfo } from "../components/match_info";
import { AccountInfo } from "./login";
import { PlayerStats } from "../components/player_stats";

export const Countdown = Resource(Type.number.logged());
console.log("Countdown", Countdown.id);
export const MatchTimer = Resource(Type.number.logged());

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

        let player1Name = this.world.get<"carrier">(
            this.world.get(NetworkConnection).isPlayer1()
                ? "localPlayer"
                : "remotePlayer"
        );
        let player2Name = this.world.get<"carrier">(
            this.world.get(NetworkConnection).isPlayer1()
                ? "remotePlayer"
                : "localPlayer"
        );

        const player1 = Player(48, 32, player1Name);
        this.player1 = player1;
        const player2 = Player(256 - 48 - 32, 32, player2Name);
        this.player2 = player2;
        // const player1 = GraphicsEnt(
        //     48,
        //     32,
        //     { fillStyle: "blue" },
        //     "drawRect",
        //     0,
        //     0,
        //     16,
        //     16
        // );
        // this.player1 = player1;
        // const player2 = GraphicsEnt(
        //     256 - 48 - 16,
        //     32,
        //     { fillStyle: "red" },
        //     "drawRect",
        //     0,
        //     0,
        //     16,
        //     16
        // );
        // this.player2 = player2;

        // for (const player of [player1, player2]) {
        //     player.remove(Graphics);
        //     console.log(player.has(Graphics), player.has(Sprite));
        //     player.add(new Sprite(Texture.from("walk_00.png")));
        //     player.get(Sprite).width = 40;
        //     player.get(Sprite).height = 32;
        //     player.add(new Velocity({ x: 0, y: 0 }));
        //     player.add(new Funds(0));
        //     // player.addScript(LaserPlayer);
        //     player.add(
        //         new PlayerInfo({
        //             canJump: true,
        //             heath: 100,
        //             shootCooldown: 0,
        //             ultPercent: 0,
        //             ultTimeLeft: 0,
        //         })
        //     );
        //     player.add(new CollisionHitbox({ x: 32, y: 32 }));
        //     player.add(
        //         new AnimatedSprite({
        //             spriteName: "walk",
        //             currentFrame: 0,
        //             thisFrameElapsed: 0,
        //             thisFrameTotal: 15,
        //             frameCount: 8,
        //         })
        //     );
        // }

        player1.add(new PeerId(this.world.get(NetworkConnection).player1));
        player2.add(new PeerId(this.world.get(NetworkConnection).player2));

        this.world.add("player_1_entity", player1);
        this.world.add("player_2_entity", player2);

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

        const width = this.world.get<number>("screenWidth");
        const height = this.world.get<number>("screenHeight");

        const walls = [
            Wall(width / 2, height - 20, width, 30, "red"),
            Wall(width / 4, height - 200, width / 8, 20, "red"),
            Wall(width * 0.75, height - 200, width / 8, 20, "red"),
            Wall(width / 2, height - 500, width / 2, 20, "red"),
            Wall(width / 16, height - 350, width / 8, 20, "red"),
            Wall(width * (15 / 16), height - 350, width / 8, 20, "red"),
            Wall(width / 2, height - 700, width / 16, 20, "red"),
            // // Wall(width/4, height -50)
            // Wall(256 - 50, 175, 50, 10, "red"),
            // Wall(256 / 2, 110, 50, 10, "red"),
        ];
        // Wait 3 seconds before starting the input sync
        this.world.add(new Countdown(3));

        const hud = this.hud;

        const player1Username = this.world.get(NetworkConnection).isPlayer1()
            ? this.world.get(AccountInfo.username)
            : this.world.get<string>("remoteUser");
        const player2Username = this.world.get(NetworkConnection).isPlayer1()
            ? this.world.get<string>("remoteUser")
            : this.world.get(AccountInfo.username);

        this.hud.element.querySelector(".text-left")!.childNodes[0].textContent =
            player1Username;
        this.hud.element.querySelector(".text-right")!.childNodes[0].textContent =
            player2Username;

        const countdownScript: Script<World> = function () {
            let lastValue = this.get(Countdown);
            this.set(Countdown.id, this.get(Countdown) - DESIRED_FRAME_TIME / 1000);
            let newValue = this.get(Countdown);

            // console.log("Countdown", lastValue, newValue);

            // Check if a second passed in between
            if (Math.floor(lastValue) !== Math.floor(newValue) && newValue > 0) {
                const el = (
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform transition-all duration-1000 text-9xl opacity-100">
                        {Math.floor(lastValue)}
                    </div>
                ) as HTMLDivElement;
                console.log("Showing countdown", el);

                hud.element.append(el);

                window.requestAnimationFrame(() => {
                    el.offsetHeight;
                    el.style.opacity = "0";
                    // el.style.transform = "scale(3) translate(-50%, -50%)";
                    el.style.setProperty("--tw-scale-x", "3");
                    el.style.setProperty("--tw-scale-y", "3");
                    // el.style.scale = "3";
                });

                setTimeout(() => {
                    el.remove();
                }, 1000);
            }

            if (this.get(Countdown) <= 0 && !this.has(MatchTimer)) {
                this.get(RollbackManager).enableRollback();
                this.add(new MatchTimer(0));
                this.addScript(() =>
                    this.set(
                        MatchTimer.id,
                        this.get(MatchTimer) + DESIRED_FRAME_TIME / 1000
                    )
                );

                // this.removeScript(countdownScript);
            }
        };
        this.world.addScript(countdownScript);

        this.hasLoadedHud = true;
    }

    update(): void {
        // Update the HUD

        if (!this.hasLoadedHud) return;

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

        this.hud.updatePlayer1UltBar(this.player1.get(PlayerInfo.ultPercent));
        this.hud.updatePlayer2UltBar(this.player2.get(PlayerInfo.ultPercent));

        if (
            this.player1.get(Funds) >= PlayerInfo.globals.targetFunds ||
            this.player2.get(Funds) >= PlayerInfo.globals.targetFunds
        ) {
            this.world.get(StateManager).moveTo(GameOverState);
        }
    }

    async onLeave(to: StateClass<any>): Promise<void> {
        const nc = this.world.get(NetworkConnection);
        this.world.add(
            new MatchInfo({
                duration: this.world.get(MatchTimer),
                winner:
                    this.player1.get(Funds) >= PlayerInfo.globals.targetFunds
                        ? "player1"
                        : "player2",
                player1: {
                    name: nc.isPlayer1()
                        ? this.world.get(AccountInfo.username)
                        : this.world.get("remoteUser"),
                    player: nc.isPlayer1()
                        ? this.world.get("localPlayer")
                        : this.world.get("remotePlayer"),
                    stats: {
                        bulletsShot: this.player1.get(PlayerStats.bulletsShot),
                        bulletsHit: this.player1.get(PlayerStats.bulletsHit),
                        bulletsReceived: this.player1.get(
                            PlayerStats.bulletsReceived
                        ),
                        ultsUsed: this.player1.get(PlayerStats.ultsUsed),
                    },
                },
                player2: {
                    name: nc.isPlayer1()
                        ? this.world.get("remoteUser")
                        : this.world.get(AccountInfo.username),
                    player: nc.isPlayer1()
                        ? this.world.get("remotePlayer")
                        : this.world.get("localPlayer"),
                    stats: {
                        bulletsShot: this.player2.get(PlayerStats.bulletsShot),
                        bulletsHit: this.player2.get(PlayerStats.bulletsHit),
                        bulletsReceived: this.player2.get(
                            PlayerStats.bulletsReceived
                        ),
                        ultsUsed: this.player2.get(PlayerStats.ultsUsed),
                    },
                },
            })
        );

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
