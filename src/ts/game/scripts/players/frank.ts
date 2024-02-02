import { MultiplayerInput } from "../../../engine/multiplayer/multiplayer_input";
import { PeerId } from "../../../engine/multiplayer/network";
import { Position } from "../../../engine/rendering/position";
import { Script } from "../../../engine/script";
import { BulletEnt } from "../../blueprints/bullet";
import { PlayerInfo } from "../../components/player_info";
import { Velocity } from "../../components/velocity";

export const FrankPlayer: Script = function () {
    const input = this.world.get(MultiplayerInput);
    const id = this.get(PeerId);

    this.set(Velocity.x, input.get("x", id) * PlayerInfo.globals.speed);
    if (input.get("y", id) < -0.3 && this.get(PlayerInfo.canJump)) {
        this.set(Velocity.y, -PlayerInfo.globals.jumpHeight);
        this.set(PlayerInfo.canJump, false);
    }

    this.inc(Velocity.y, PlayerInfo.globals.gravity);

    if (
        input.is("shoot", "PRESSED", id) &&
        this.get(PlayerInfo.shootCooldown) <= 0
    ) {
        this.set(PlayerInfo.shootCooldown, PlayerInfo.globals.fireCooldown);
        BulletEnt(
            this.get(Position.x),
            this.get(Position.y),
            Math.cos(input.get("aim", id)) * 7,
            Math.sin(input.get("aim", id)) * 7
        );
    } else {
        this.inc(PlayerInfo.shootCooldown, -1);
    }

    if (this.get(PlayerInfo.ultPercent) >= 100 && input.is("ult", "PRESSED", id)) {
        this.set(PlayerInfo.ultPercent, 0);
        this.set(PlayerInfo.ultTimeLeft, PlayerInfo.globals.ultLength);
    }
};
