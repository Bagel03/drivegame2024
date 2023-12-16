import { Component, Type } from "bagelecs";
import { MultiplayerInput } from "../../engine/multiplayer/multiplayer_input";
import { NetworkConnection, PeerId } from "../../engine/multiplayer/network";
import { Script } from "../../engine/script";
import { Position } from "../../engine/rendering/position";
import { Velocity } from "../components/velocity";
import { BulletEnt } from "../blueprints/bullet";

export const PlayerInfo = Component(
    Type({
        shootTimer: Type.number,
        dashTimer: Type.number,
    }).ranged(2)
);

export const movementScript: Script = function () {
    const id = this.get(PeerId);
    const input = this.world.get(MultiplayerInput);

    // const canJump = this.get(PlayerInfo.canJump);

    this.set(Velocity.x, input.get(id, "x") * 3);
    this.set(Velocity.y, input.get(id, "y") * 3);

    if (input.is(id, "dash", "JUST_PRESSED")) {
        this.set(PlayerInfo.dashTimer, 15);
    }

    if (this.get(PlayerInfo.dashTimer) > 0) {
        this.inc(PlayerInfo.dashTimer, -1);
        this.mult(Velocity.x, 3);
        this.mult(Velocity.x, 3);
    }

    // this.inc(Velocity.y, 0.25);

    // if (input.is(id, "jump", "JUST_PRESSED") && canJump) {
    //     this.update(Velocity.y, -8);
    // }

    if (input.is(id, "shoot", "JUST_PRESSED")) {
        BulletEnt(
            this.get(Position.x),
            this.get(Position.y),
            input.get(id, "aimx") * 8 + this.get(Velocity.x),
            input.get(id, "aimy") * 8 + this.get(Velocity.y),
            "purple"
        );
    }
};
