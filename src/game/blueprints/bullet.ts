import { AdvancedBlueprintFactory, Blueprint, Entity, TypeId } from "bagelecs";
import { Velocity } from "../components/velocity";
import { Position } from "../../engine/rendering/position";
import { Graphics } from "pixi.js";
import { TimedAlive } from "../components/timed";

const bulletBlueprint = new Blueprint(
    Position,
    Velocity,
    Graphics,
    new TimedAlive(1000)
);

export const BulletEnt = AdvancedBlueprintFactory(
    bulletBlueprint,
    [Position.x, Position.y, Velocity.x, Velocity.y],
    function (fillColor: string) {
        this.update(Position.r, 0);

        const graphics = new Graphics();
        graphics.beginFill(fillColor);
        graphics.arc(0, 0, 5, 0, Math.PI * 2);

        this.update(graphics);
    }
) as (x: number, y: number, vx: number, vy: number, color: string) => Entity;
