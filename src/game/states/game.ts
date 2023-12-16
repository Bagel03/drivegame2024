import { Component, Type } from "bagelecs";
import { monitor } from "../../editor/inspect";
import { NetworkConnection, PeerId } from "../../engine/multiplayer/network";
import { State, StateClass } from "../../engine/state_managment";
import { PlayerInfo, movementScript } from "../scripts/movement";
import { GraphicsEnt } from "../../engine/rendering/blueprints/graphics";
import { Graphics } from "pixi.js";
import { Velocity } from "../components/velocity";
import { MissileEnt } from "../blueprints/missile";
import { ShotgunEnt } from "../blueprints/shotgun";
import { RemoveDeadEntities } from "../systems/timed";

export class Game extends State<never> {
    async onEnter<From extends StateClass<any>>(
        payload: never,
        from: From
    ): Promise<void> {
        this.world.addSystem(RemoveDeadEntities);
        this.world.addSystem(RemoveDeadEntities, "rollback");

        // const platform = spawnStaticGraphics(
        //     0,
        //     200,
        //     0,
        //     "gray",
        //     0,
        //     0,
        //     400,
        //     0,
        //     400,
        //     20,
        //     0,
        //     20
        // );
        // platform.add(new Hitbox({ w: 400, h: 20 }));
        // // const old = platform.get(Graphics).position.cb;
        // // platform.get(Graphics).position.cb = function () {
        // //     old();
        // //     console.trace();
        // //     debugger;
        // // }.bind(platform.get(Graphics).position.scope);

        // const nc = this.world.get(NetworkConnection);
        // nc.remoteIds.forEach((id) => {
        //     const player = spawnGraphics(
        //         0,
        //         50,
        //         "red",
        //         0,
        //         0,
        //         50,
        //         0,
        //         50,
        //         50,
        //         0,
        //         50
        //     );
        //     player.add(new Hitbox({ w: 50, h: 50 }));
        //     player.add(new Velocity({ x: 0, y: 0 }));
        //     player.add(new PeerId(id));
        //     player.add(new PlayerInfo({ canJump: true, shootTimer: 0 }));
        //     player.addScript(movementScript);
        //     monitor(player, Position.x, "Remote X");
        // });

        // const localPlayer = spawnGraphics(
        //     0,
        //     50,
        //     "blue",
        //     0,
        //     0,
        //     50,
        //     0,
        //     50,
        //     50,
        //     0,
        //     50
        // );

        // console.log(Position.x);

        // localPlayer.add(new Hitbox({ w: 50, h: 50 }));
        // localPlayer.add(new Velocity({ x: 0, y: 0 }));
        // localPlayer.add(new PeerId(nc.id));
        // const info = new PlayerInfo({ canJump: true, shootTimer: 0 });
        // localPlayer.add(info);
        // console.log(info);

        // localPlayer.addScript(movementScript);
        // monitor(localPlayer, Position.x, "Local X");
        const graphics = new Graphics();
        graphics.beginFill("#8f24bd");
        graphics.arc(0, 0, 30, 0, Math.PI * 2);

        const player = GraphicsEnt(
            50,
            50,
            { fillStyle: "#8f24bd" },
            "arc",
            0,
            0,
            30,
            0,
            Math.PI * 2
        );
        // player.add(graphics);
        // player.add(new Position({ x: 50, y: 50 }));
        player.add(new PlayerInfo({ shootTimer: 0, dashTimer: 0 }));
        player.addScript(movementScript);
        player.add(new Velocity({ x: 0, y: 0 }));
        player.add(new PeerId(this.world.get(NetworkConnection).id));

        let missilePos = [
            [100, 100, -Math.PI / 4],
            [700, 100, (-3 * Math.PI) / 4],
            [700, 700, (3 * Math.PI) / 4],
            [100, 700, Math.PI / 4],
        ];
        setTimeout(() => {
            for (const [x, y, r] of missilePos) {
                let m = MissileEnt(x, y, r);
                m.relate("target", player);
            }
        }, 1000);

        setTimeout(() => {
            for (const [x, y, r] of missilePos) {
                let m = ShotgunEnt(x, y, r);
                m.relate("target", player);
            }
        }, 5000);
    }

    update() {}
    async onLeave() {}
}
