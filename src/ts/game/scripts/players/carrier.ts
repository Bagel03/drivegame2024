import { DESIRED_FPS } from "../../../engine/loop";
import { MultiplayerInput } from "../../../engine/multiplayer/multiplayer_input";
import { PeerId } from "../../../engine/multiplayer/network";
import { Position } from "../../../engine/rendering/position";
import { Script } from "../../../engine/script";
import { BulletEnt } from "../../blueprints/bullet";
import { PlayerInfo } from "../../components/player_info";
import { Velocity } from "../../components/velocity";
import { applyDefaultMovement, applyDefaultShooting } from "./common";

export const CARRIER_ULT_COOLDOWN = DESIRED_FPS * 10;

export const MrCarrierPlayer: Script = function () {
    const input = this.world.get(MultiplayerInput);
    const id = this.get(PeerId);

    if (this.get(PlayerInfo.ultPercent) >= 100 && input.is("ult", "PRESSED", id)) {
        this.set(PlayerInfo.ultPercent, 0);
        this.set(PlayerInfo.ultTimeLeft, CARRIER_ULT_COOLDOWN);
    }

    // Allow flying while ulting
    if (this.get(PlayerInfo.ultTimeLeft) > 0) {
        if (input.get("y", id) >= 0) {
            this.inc(Velocity.y, PlayerInfo.globals.gravity / 2);
        } else {
            this.inc(Velocity.y, input.get("y", id) / 100);
            if (this.get(Velocity.y) < -PlayerInfo.globals.gravity) {
                this.set(Velocity.y, -PlayerInfo.globals.gravity);
            }
        }

        this.inc(Velocity.y, Math.min(input.get("y", id), 0));
        this.inc(PlayerInfo.ultTimeLeft, -1);

        this.update(Velocity.x, input.get("x", id) * PlayerInfo.globals.speed);
    } else {
        this.inc(PlayerInfo.ultPercent);
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
