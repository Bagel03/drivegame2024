// TODO: Name this guy

import { Entity, Relationship } from "bagelecs";
import { MultiplayerInput } from "../../../engine/multiplayer/multiplayer_input";
import { PeerId } from "../../../engine/multiplayer/network";
import { Position } from "../../../engine/rendering/position";
import { Script } from "../../../engine/script";
import { BulletEnt } from "../../blueprints/bullet";
import { PlayerInfo } from "../../components/player_info";
import { Velocity } from "../../components/velocity";
import { applyDefaultMovement, applyDefaultShooting } from "./common";
import { Container, Graphics } from "pixi.js";

export const LaserPlayer: Script = function () {
    const input = this.world.get(MultiplayerInput);
    const id = this.get(PeerId);

    applyDefaultMovement(this, input, id);

    if (this.get(PlayerInfo.ultPercent) >= 100 && input.is("ult", "PRESSED", id)) {
        this.set(PlayerInfo.ultPercent, 0);
        this.set(PlayerInfo.ultTimeLeft, 1);
    } else {
        this.inc(PlayerInfo.ultPercent);
    }

    if (this.get(PlayerInfo.ultTimeLeft) > 0) {
        // Laser
        if (input.is("shoot", "JUST_RELEASED", id)) {
            for (let i = 0; i < 10; i++) {
                const velX = Math.cos(input.get("aim", id));
                const velY = Math.sin(input.get("aim", id));

                BulletEnt(
                    this.get(Position.x) + velX * i * 30,
                    this.get(Position.y) + velY * i * 30,
                    velX * 20,
                    velY * 20
                );
            }
            this.inc(PlayerInfo.ultTimeLeft, -1 / 3);

            this.get(Container).getChildByName("aimguide")?.removeFromParent();
        } else if (input.is("shoot", "PRESSED", id)) {
            const container = this.get(Container);
            if (container.children.length == 0) {
                const graphics = new Graphics();
                graphics.lineStyle(5, 0xff0000, 0.5);
                graphics.moveTo(0, 0);
                graphics.lineTo(1000, 0);
                graphics.name = "aimguide";
                container.addChild(graphics);
            }

            container.getChildByName("aimguide")!.rotation = input.get("aim", id);
            // guide.add(graphics);
            // this.relate("aimguide", guide);

            // const guide = this.getSingleRelatedBy("aimguide")!;
            // guide.set(Position.r, input.get("aim", id));
        }
    } else {
        applyDefaultShooting(this, input, id);
    }

    // if (
    //     input.is("shoot", "PRESSED", id) &&
    //     this.get(PlayerInfo.shootCooldown) <= 0
    // ) {
    //     this.set(PlayerInfo.shootCooldown, PlayerInfo.globals.fireCooldown);
    //     BulletEnt(
    //         this.get(Position.x),
    //         this.get(Position.y),
    //         Math.cos(input.get("aim", id)) * 7,
    //         Math.sin(input.get("aim", id)) * 7
    //     );
    // } else {
    //     this.inc(PlayerInfo.shootCooldown, -1);
    // }

    // if (this.get(PlayerInfo.ultPercent) >= 100 && input.is("ult", "PRESSED", id)) {
    //     this.set(PlayerInfo.ultPercent, 0);
    //     this.set(PlayerInfo.ultTimeLeft, PlayerInfo.globals.ultLength);
    // }
};
