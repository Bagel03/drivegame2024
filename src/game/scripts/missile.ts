import { Entity, Relationship } from "bagelecs";
import { Position } from "../../engine/rendering/position";
import { Velocity } from "../components/velocity";

export function MissileScript(this: Entity) {
    const target = this.getSingleRelatedBy("target")!;

    let theta = Math.atan2(
        target.get(Position.y) - this.get(Position.y),
        target.get(Position.x) - this.get(Position.x)
    );
    // if (theta < 0) theta = 2 * Math.PI - theta;

    if (Math.abs(this.get(Position.r) - theta) > 0.05)
        this.inc(Position.r, (theta - this.get(Position.r)) * 0.1);

    // console.log(theta);

    // this.inc(Position.r, theta);

    this.inc(Velocity.x, Math.cos(this.get(Position.r)) * 0.1);
    this.inc(Velocity.y, Math.sin(this.get(Position.r)) * 0.1);
    this.set(Velocity.x, Math.min(5, Math.max(this.get(Velocity.x), -5)));
    this.set(Velocity.y, Math.min(5, Math.max(this.get(Velocity.y), -5)));
}
