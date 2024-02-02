import { AdvancedBlueprintFactory, Blueprint, Entity, TypeId } from "bagelecs";
import { Velocity } from "../components/velocity";
import { Position } from "../../engine/rendering/position";
import { Graphics, Sprite, Texture } from "pixi.js";
import { TimedAlive } from "../components/timed";
import { NetworkConnection } from "../../engine/multiplayer/network";
import { CollisionHeath, CollisionHitbox } from "../components/collision";

const bulletBlueprint = new Blueprint(
    Position,
    Velocity,
    Graphics,
    new TimedAlive(100),
    new CollisionHeath(1),
    new CollisionHitbox({ x: 2, y: 2 })
);

export const BulletEnt = AdvancedBlueprintFactory(
    bulletBlueprint,
    [Position.x, Position.y, Velocity.x, Velocity.y],
    function () {
        this.update(
            Position.r,
            Math.atan2(this.get(Velocity.y), this.get(Velocity.x))
        );
        const sprite = new Sprite(Texture.from("ticket.png"));
        this.update(sprite);
        sprite.width = 8;
        sprite.height = 4;
    }
) as (x: number, y: number, vx: number, vy: number) => Entity;
