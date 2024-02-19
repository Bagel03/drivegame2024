import { AdvancedBlueprintFactory, Blueprint, Entity, TypeId } from "bagelecs";
import { ColorSource, Container, Graphics } from "pixi.js";
import { Position, StaticPosition } from "../../engine/rendering/position";
import { CollisionHitbox } from "../components/collision";

const wallBlueprint = new Blueprint(Container, StaticPosition, CollisionHitbox);

export const Wall = AdvancedBlueprintFactory(
    wallBlueprint,
    [
        StaticPosition.x,
        StaticPosition.y,
        CollisionHitbox.x,
        CollisionHitbox.y,
    ] as const,
    function (color: ColorSource) {
        const graphics = new Graphics();
        graphics
            .beginFill(color)
            .drawRect(
                -this.get(CollisionHitbox.x) / 2,
                -this.get(CollisionHitbox.y) / 2,
                this.get(CollisionHitbox.x),
                this.get(CollisionHitbox.y)
            )
            .endFill()
            .position.set(this.get(StaticPosition.x), this.get(StaticPosition.y));
        // graphics.pivot.set()
        this.set(graphics);
    }
) as (
    x: number,
    y: number,
    width: number,
    height: number,
    color: ColorSource
) => Entity;
