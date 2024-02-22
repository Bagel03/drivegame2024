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
import { PlayerStats } from "../../components/player_stats";
import { GlowFilter } from "@pixi/filter-glow";

export const ShotgunPlayer: Script = function () {
    const input = this.world.get(MultiplayerInput);
    const id = this.get(PeerId);

    applyDefaultMovement(this, input, id);

    if (
        this.get(PlayerInfo.ultPercent) >= 100 &&
        input.is("ult", "PRESSED", id) &&
        !this.get(PlayerInfo.inUlt)
    ) {
        this.set(PlayerInfo.inUlt, true);
        this.inc(PlayerStats.ultsUsed);
        this.set(PlayerInfo.ultPercent, 100);
        this.get(Container).filters = [
            new GlowFilter({
                color: 0x00ff00,
                outerStrength: 3,
                innerStrength: 1,
                distance: 15,
            }),
        ];
    }

    const shotgunRange = Math.PI / 3;
    const shotgunBullets = 10;

    if (this.get(PlayerInfo.inUlt)) {
        // Shotgun
        if (input.is("shoot", "JUST_RELEASED", id)) {
            for (let i = 0; i < shotgunBullets; i++) {
                const angle =
                    input.get("aim", id) -
                    shotgunRange / 2 +
                    (shotgunRange * i) / shotgunBullets;

                const velX = Math.cos(angle);
                const velY = Math.sin(angle);

                this.inc(PlayerStats.bulletsShot);
                BulletEnt(
                    this,
                    5,
                    this.get(Position.x) + velX,
                    this.get(Position.y) + velY,
                    velX * 15,
                    velY * 15
                );
            }
            this.inc(PlayerInfo.ultPercent, -34);
            if (this.get(PlayerInfo.ultPercent) <= 0) {
                this.set(PlayerInfo.inUlt, false);
                this.set(PlayerInfo.ultPercent, 0);
                this.get(Container).filters = [];
            }

            // this.get(Container).getChildByName("aimguide")?.removeFromParent();
        } else if (input.is("shoot", "PRESSED", id)) {
            // const container = this.get(Container);
            // if (container.children.length == 0) {
            //     const graphics = new Graphics();
            //     graphics.lineStyle(50, 0xff0000, 0.5);
            //     graphics.moveTo(0, 0);
            //     graphics.lineTo(1000000, 0);
            //     graphics.name = "aimguide";
            //     container.addChild(graphics);
            // }
            // container.getChildByName("aimguide")!.rotation = input.get("aim", id);
            // // guide.add(graphics);
            // this.relate("aimguide", guide);
            // const guide = this.getSingleRelatedBy("aimguide")!;
            // guide.set(Position.r, input.get("aim", id));
        }
    } else {
        applyDefaultShooting(this, input, id);
    }
};
