import { Component, Type } from "bagelecs";
import { DESIRED_FPS } from "../../engine/loop";

export class PlayerInfo extends Component(
    Type({
        canJump: Type.bool,
        heath: Type.number,
        ultPercent: Type.number,
        ultTimeLeft: Type.number,
        shootCooldown: Type.number,
    }).logged()
) {
    static readonly globals = {
        maxHealth: 100,
        jumpHeight: 9,
        gravity: 0.6,
        speed: 2,
        fireCooldown: DESIRED_FPS / 6,
        ultLength: DESIRED_FPS * 5,
    };
}
