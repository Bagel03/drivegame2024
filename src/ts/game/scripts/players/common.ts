import { Entity } from "bagelecs";
import { MultiplayerInput } from "../../../engine/multiplayer/multiplayer_input";
import { Velocity } from "../../components/velocity";
import { PlayerInfo } from "../../components/player_info";
import { BulletEnt } from "../../blueprints/bullet";
import { Position } from "../../../engine/rendering/position";

export function applyDefaultMovement(
    entity: Entity,
    input: MultiplayerInput,
    id: string
) {
    entity.inc(Velocity.y, PlayerInfo.globals.gravity);

    if (input.get("y", id) < -0.3 && entity.get(PlayerInfo.canJump)) {
        entity.set(Velocity.y, -PlayerInfo.globals.jumpHeight);
        entity.set(PlayerInfo.canJump, false);
    }
    entity.update(Velocity.x, input.get("x", id) * PlayerInfo.globals.speed);
}

export function applyDefaultShooting(
    entity: Entity,
    input: MultiplayerInput,
    id: string
) {
    if (
        input.is("shoot", "PRESSED", id) &&
        entity.get(PlayerInfo.shootCooldown) <= 0
    ) {
        entity.set(PlayerInfo.shootCooldown, PlayerInfo.globals.fireCooldown);
        BulletEnt(
            entity.get(Position.x),
            entity.get(Position.y),
            Math.cos(input.get("aim", id)) * 7,
            Math.sin(input.get("aim", id)) * 7
        );
    } else {
        entity.inc(PlayerInfo.shootCooldown, -1);
    }
}
