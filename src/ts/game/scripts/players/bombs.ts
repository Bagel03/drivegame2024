import { Graphics } from "pixi.js";
import { DESIRED_FPS } from "../../../engine/loop";
import { MultiplayerInput } from "../../../engine/multiplayer/multiplayer_input";
import { PeerId } from "../../../engine/multiplayer/network";
import { Position } from "../../../engine/rendering/position";
import { Script } from "../../../engine/script";
import { BouncinessFactor, CollisionHitbox } from "../../components/collision";
import { PlayerInfo } from "../../components/player_info";
import { Friction, Velocity } from "../../components/velocity";
import { gravity } from "../gravity";
import { applyDefaultMovement } from "./common";

export const BombPlayer: Script = function () {
    const input = this.world.get(MultiplayerInput);
    const id = this.get(PeerId);

    applyDefaultMovement(this, input, id);

    if (this.get(PlayerInfo.ultPercent) >= 100 && input.is("ult", "PRESSED", id)) {
        this.set(PlayerInfo.ultPercent, 0);
        this.set(PlayerInfo.ultTimeLeft, DESIRED_FPS * 10);
    } else {
        this.inc(PlayerInfo.ultPercent);
    }

    if (this.get(PlayerInfo.ultTimeLeft) > 0) {
        this.inc(PlayerInfo.ultTimeLeft, -1);
        // Targeted missiles

        if (
            input.is("shoot", "PRESSED") &&
            this.get(PlayerInfo.shootCooldown) <= 0
        ) {
            this.set(PlayerInfo.shootCooldown, 0);
            // Shoot missile
        } else {
            this.inc(PlayerInfo.shootCooldown, -1);
        }
    } else {
        // Normal bombs
        if (
            input.is("shoot", "PRESSED") &&
            this.get(PlayerInfo.shootCooldown) <= 0
        ) {
            this.set(PlayerInfo.shootCooldown, PlayerInfo.globals.fireCooldown);
            const bomb = this.world.spawn();
            console.log(bomb);
            bomb.add(
                new Position({
                    x: this.get(Position.x),
                    y: this.get(Position.y),
                    r: 0,
                })
            );
            bomb.add(
                new Velocity({
                    x: Math.cos(input.get("aim")) * 3,
                    y: Math.sin(input.get("aim")) * 10,
                })
            );
            bomb.add(new CollisionHitbox({ x: 20, y: 20 }));
            bomb.addScript(gravity);
            const graphics = new Graphics();
            graphics.beginFill(0xff0000);
            graphics.drawCircle(10, 10, 10);
            graphics.endFill();
            bomb.add(graphics);
            bomb.add(new BouncinessFactor({ x: 0.5, y: 0 }));
            bomb.add(new Friction(0.05));
        } else {
            this.inc(PlayerInfo.shootCooldown, -1);
        }
    }
};
