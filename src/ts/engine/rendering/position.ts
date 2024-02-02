import { Entity, Type } from "bagelecs";
import { Component } from "bagelecs";

export class Position extends Component(
    Type({
        x: Type.number,
        y: Type.number,
        r: Type.number,
    }).logged()
) {
    add(x: number, y: number, r?: number): void;
    add(other: Entity): void;
    add(xOrEntity: Entity, y?: number, r = 0) {
        if (y !== undefined) {
            this.x += xOrEntity.get(Position.x);
            this.y += xOrEntity.get(Position.y);
            this.r += xOrEntity.get(Position.r);
        } else {
            this.x += xOrEntity;
            this.y += y!;
            this.r += r;
        }
    }
}

export class StaticPosition extends Component(Type.vec2) {}
