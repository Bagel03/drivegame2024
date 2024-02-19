import { Component, Type } from "bagelecs";
import { DESIRED_FPS } from "../../engine/loop";

export class PlayerInfo extends Component(
    Type({
        canJump: Type.bool,
        heath: Type.number,
        ultPercent: Type.number,
        inUlt: Type.bool,
        shootCooldown: Type.number,
    }).logged()
) {
    static readonly globals = {
        maxHealth: 100,
        jumpHeight: 25,
        gravity: 1,
        speed: 8,
        fireCooldown: DESIRED_FPS / 6,
        ultLength: DESIRED_FPS * 5,
        targetFunds: 100,
    };
}

console.log("Ult precent", PlayerInfo.ultPercent);
