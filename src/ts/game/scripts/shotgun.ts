import { Entity } from "bagelecs";
import { GroundEnemyInfo } from "../components/ground_enemy";
import { BulletEnt } from "../blueprints/bullet";
import { Position } from "../../engine/rendering/position";
import { Velocity } from "../components/velocity";

const cos30 = Math.sqrt(3) / 2;
const sin30 = 1 / 2;

export function ShotgunScript(this: Entity) {
    this.inc(GroundEnemyInfo.shotTimer, -1);

    if (this.get(GroundEnemyInfo.shotTimer) < 0) {
        BulletEnt(
            this.get(Position.x),
            this.get(Position.y),
            this.get(Velocity.x) * 2,
            this.get(Velocity.y) * 2,
            "green"
        );
        BulletEnt(
            this.get(Position.x),
            this.get(Position.y),
            (this.get(Velocity.x) * cos30 - this.get(Velocity.y) * sin30) * 2,
            (this.get(Velocity.y) * cos30 + this.get(Velocity.x) * sin30) * 2,
            "green"
        );
        BulletEnt(
            this.get(Position.x),
            this.get(Position.y),
            (this.get(Velocity.x) * cos30 - this.get(Velocity.y) * -sin30) * 2,
            (this.get(Velocity.y) * cos30 + this.get(Velocity.x) * -sin30) * 2,
            "green"
        );

        this.set(GroundEnemyInfo.shotTimer, 120);
    }

    const target = this.getSingleRelatedBy("target")!;
    if (target.get(Position.x) > this.get(Position.x)) this.set(Velocity.x, 1);
    else this.set(Velocity.x, -1);

    if (target.get(Position.y) > this.get(Position.y)) this.set(Velocity.y, 1);
    else this.set(Velocity.y, -1);
}
