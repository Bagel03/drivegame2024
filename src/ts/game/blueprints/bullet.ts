import { AdvancedBlueprintFactory, Blueprint, Entity, TypeId } from "bagelecs";
import { Velocity } from "../components/velocity";
import { Position } from "../../engine/rendering/position";
import { Graphics, Sprite, Texture } from "pixi.js";
import { TimedAlive } from "../components/timed";
import { NetworkConnection } from "../../engine/multiplayer/network";
import { CollisionHeath, CollisionHitbox } from "../components/collision";
import { Cost } from "../components/cost";

const bulletBlueprint = new Blueprint(
    Position,
    Velocity,
    Graphics,
    Cost,
    new TimedAlive(100),
    new CollisionHeath(1),
    new CollisionHitbox({ x: 2, y: 2 })
);

export const BulletEnt = AdvancedBlueprintFactory(
    bulletBlueprint,
    [Cost.payTo, Cost.price, Position.x, Position.y, Velocity.x, Velocity.y],
    function () {
        this.update(
            Position.r,
            Math.atan2(this.get(Velocity.y), this.get(Velocity.x))
        );
        const sprite = new Sprite(Texture.from("ticket.png"));
        this.update(sprite);
        sprite.width = 32;
        sprite.height = 16;
    }
) as (
    shotFrom: Entity,
    damage: number,
    x: number,
    y: number,
    vx: number,
    vy: number
) => Entity;
