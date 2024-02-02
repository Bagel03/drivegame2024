import { Graphics, Sprite, Texture } from "pixi.js";
import { NetworkConnection, PeerId } from "../../engine/multiplayer/network";
import { AnimatedSprite } from "../../engine/rendering/animation";
import { GraphicsEnt } from "../../engine/rendering/blueprints/graphics";
import { StateClass } from "../../engine/state_managment";
import { CollisionHitbox } from "../components/collision";
import { PlayerInfo } from "../components/player_info";
import { Velocity } from "../components/velocity";
import { BombPlayer } from "../scripts/players/bombs";
import { MrCarrierPlayer } from "../scripts/players/carrier";
import { MrGriffinPlayer } from "../scripts/players/griffin";
import { LaserPlayer } from "../scripts/players/laser";
import { Game } from "./game";

export class SoloGame extends Game {
    async onEnter<From extends StateClass<any>>(
        payload: never,
        from: From
    ): Promise<void> {
        await super.onEnter(payload, from);

        const player = GraphicsEnt(
            48,
            32,
            { fillStyle: "blue" },
            "drawRect",
            0,
            0,
            16,
            16
        );
        player.remove(Graphics);
        player.add(new Sprite(Texture.from("walk_00.png")));
        player.get(Sprite).width = 40;
        player.get(Sprite).height = 32;
        player.addScript(MrCarrierPlayer);
        player.add(new Velocity({ x: 0, y: 0 }));
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
        // Look into removing this
        player.add(new PeerId(this.world.get(NetworkConnection).id));
        player.add(
            new AnimatedSprite({
                spriteName: "walk",
                currentFrame: 0,
                thisFrameElapsed: 0, // Note that both of these are in frames, not ms or seconds
                thisFrameTotal: 15,
                frameCount: 8,
            })
        );

        this.world.add(player, "local_player");
    }
}
