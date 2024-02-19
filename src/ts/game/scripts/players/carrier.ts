import { Sprite } from "pixi.js";
import { DESIRED_FPS } from "../../../engine/loop";
import { MultiplayerInput } from "../../../engine/multiplayer/multiplayer_input";
import { PeerId } from "../../../engine/multiplayer/network";
import { AnimatedSprite } from "../../../engine/rendering/animation";
import { Position } from "../../../engine/rendering/position";
import { Script } from "../../../engine/script";
import { BulletEnt } from "../../blueprints/bullet";
import { Facing } from "../../components/facing";
import { PlayerInfo } from "../../components/player_info";
import { PlayerStats } from "../../components/player_stats";
import { Velocity } from "../../components/velocity";
import { applyDefaultMovement, applyDefaultShooting } from "./common";
import { GlowFilter } from "@pixi/filter-glow";

// export const CARRIER_ULT_COOLDOWN = DESIRED_FPS * 10;

export const MrCarrierPlayer: Script = function () {
    const input = this.world.get(MultiplayerInput);
    const id = this.get(PeerId);

    if (
        this.get(PlayerInfo.ultPercent) >= 100 &&
        input.is("ult", "PRESSED", id) &&
        !this.get(PlayerInfo.inUlt)
    ) {
        this.set(PlayerInfo.inUlt, true);
        this.inc(PlayerStats.ultsUsed);
        this.set(PlayerInfo.ultPercent, 100);
        this.get(Sprite).filters = [
            new GlowFilter({
                color: 0x00ff00,
                outerStrength: 3,
                innerStrength: 1,
                distance: 15,
            }),
        ];
        // this.set(
        //     PlayerInfo.ultPercent,
        //     Math.min(this.get(PlayerInfo.ultPercent) + 1, 100)
        // );
    }

    if (this.get(PlayerInfo.inUlt) && this.get(PlayerInfo.ultPercent) <= 0) {
        this.set(PlayerInfo.inUlt, false);
        this.set(PlayerInfo.ultPercent, 0);
        this.get(Sprite).filters = [];
    }

    // Allow flying while ulting
    if (this.get(PlayerInfo.inUlt)) {
        if (input.get("y", id) >= 0) {
            this.inc(Velocity.y, PlayerInfo.globals.gravity / 2);
        } else {
            this.inc(Velocity.y, input.get("y", id) / 100);
            if (this.get(Velocity.y) < -PlayerInfo.globals.gravity) {
                this.set(Velocity.y, -PlayerInfo.globals.gravity);
            }
        }

        this.inc(Velocity.y, Math.min(input.get("y", id), 0));
        this.inc(PlayerInfo.ultPercent, -1 / 3);

        // if (this.get(PlayerInfo.ultPercent) <= 0) {
        //     this.set(PlayerInfo.inUlt, false);
        //     this.set(PlayerInfo.ultPercent, 0);
        //     // Change out of it
        // }
        // this.inc(PlayerInfo.ultTimeLeft, -1);

        this.update(Velocity.x, input.get("x", id) * PlayerInfo.globals.speed);

        if (this.get(Velocity.x) > 0 && this.get(Facing) !== "right") {
            this.set(Facing.id, "right");
            AnimatedSprite.onChangeDirection(this);
            // console.log("changed direction to right");
        } else if (this.get(Velocity.x) < 0 && this.get(Facing) !== "left") {
            // console.log("Changing to left");
            this.set(Facing.id, "left");
            AnimatedSprite.onChangeDirection(this);
        }
    } else {
        applyDefaultMovement(this, input, id);
    }

    applyDefaultShooting(this, input, id);
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
    // }

    // this.inc(PlayerInfo.shootCooldown, -1);
};
