import { Entity } from "bagelecs";
import { MultiplayerInput } from "../../../engine/multiplayer/multiplayer_input";
import { Velocity } from "../../components/velocity";
import { PlayerInfo } from "../../components/player_info";
import { BulletEnt } from "../../blueprints/bullet";
import { Position } from "../../../engine/rendering/position";
import type { Countdown } from "../../states/multiplayer";
import { PlayerStats } from "../../components/player_stats";
import { AnimatedSprite } from "../../../engine/rendering/animation";
import { PlayerIdentifier } from "../../blueprints/player";
import { Players } from "../../players";

let CountdownClass: typeof Countdown;
import("../../states/multiplayer").then((module) => {
    CountdownClass = module.Countdown;
    console.log("CountdownClass", CountdownClass);
});
// const { Countdown } = await import("../../states/multiplayer");

export function applyDefaultMovement(
    entity: Entity,
    input: MultiplayerInput,
    id: string
) {
    if (entity.world.get(CountdownClass) > 0) return;

    const spritePrefix =
        Players[entity.get(PlayerIdentifier) as "carrier"].spriteName;
    const spritePostfix = entity.get(AnimatedSprite.spriteName).split("-")[1];

    if (input.get("y", id) < -0.3 && entity.get(PlayerInfo.canJump)) {
        AnimatedSprite.changeSprite(entity, spritePrefix + "-jump", 3, false, 8);
        entity.set(Velocity.y, -PlayerInfo.globals.jumpHeight);
        entity.set(PlayerInfo.canJump, false);
    }

    entity.update(Velocity.x, input.get("x", id) * PlayerInfo.globals.speed);
    entity.inc(Velocity.y, PlayerInfo.globals.gravity);

    if (!entity.get(PlayerInfo.canJump)) return;

    if (entity.get(Velocity.x) > 0 && spritePostfix !== "runright") {
        AnimatedSprite.changeSprite(entity, spritePrefix + "-runright", 4);
    } else if (entity.get(Velocity.x) === 0 && spritePostfix !== "idleright") {
        AnimatedSprite.changeSprite(entity, spritePrefix + "-idleright", 1);
    } else {
        // Change to walking left
    }
}

export function applyDefaultShooting(
    entity: Entity,
    input: MultiplayerInput,
    id: string
) {
    if (entity.world.get(CountdownClass) > 0) return;

    if (
        input.is("shoot", "PRESSED", id) &&
        entity.get(PlayerInfo.shootCooldown) <= 0
    ) {
        entity.set(PlayerInfo.shootCooldown, PlayerInfo.globals.fireCooldown);
        entity.inc(PlayerStats.bulletsShot);
        BulletEnt(
            entity,
            5,
            entity.get(Position.x),
            entity.get(Position.y),
            Math.cos(input.get("aim", id)) * 7,
            Math.sin(input.get("aim", id)) * 7
        );
    } else {
        entity.inc(PlayerInfo.shootCooldown, -1);
    }
}
