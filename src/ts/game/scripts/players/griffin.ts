import { Component, Type } from "bagelecs";
import { Input } from "../../../engine/input/input";
import { Script } from "../../../engine/script";
import { Velocity } from "../../components/velocity";
import { PlayerInfo } from "../../components/player_info";
import { PeerId } from "../../../engine/multiplayer/network";
import { BulletEnt } from "../../blueprints/bullet";
import { Position } from "../../../engine/rendering/position";
import { MultiplayerInput } from "../../../engine/multiplayer/multiplayer_input";

export const MrGriffinPlayer: Script = function () {
    const input = this.world.get(MultiplayerInput);
    const id = this.get(PeerId);

    this.update(Velocity.x, input.get("x", id) * PlayerInfo.globals.speed);

    this.inc(Velocity.y, PlayerInfo.globals.gravity);
    // console.log("Updated velocity", this.get(Velocity.y));

    if (this.get(PlayerInfo.canJump) && input.get("y", id) < 0) {
        console.log("jump");
        this.set(Velocity.y, -PlayerInfo.globals.jumpHeight);
        this.set(PlayerInfo.canJump, false);
    }

    if (input.is("shoot", "JUST_PRESSED", id)) {
        BulletEnt(
            this.get(Position.x),
            this.get(Position.y),
            Math.cos(input.get("aim", id)) * 1, //+ this.get(Velocity.x),
            Math.sin(input.get("aim", id)) * 1, //+ this.get(Velocity.y),
            "purple"
        );
    }
    // this.update(Velocity.y, input.get("y"));
};
