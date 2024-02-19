import { Entity, System, With } from "bagelecs";
import { Position, StaticPosition } from "../../engine/rendering/position";
import {
    BouncinessFactor,
    CollisionHeath,
    CollisionHitbox,
} from "../components/collision";
import { Velocity } from "../components/velocity";
import { PlayerInfo } from "../components/player_info";

export class CollisionSystem extends System({
    static: With(StaticPosition, CollisionHitbox),
    moving: With(Position, CollisionHitbox, Velocity),
}) {
    queueForDestroy: Set<Entity> = new Set();

    update(): void {
        this.entities.static.forEach((staticEntity) => {
            this.entities.moving.forEach((movingEntity) => {
                const staticWidth = staticEntity.get(CollisionHitbox.x);
                const staticHeight = staticEntity.get(CollisionHitbox.y);

                const staticX = staticEntity.get(StaticPosition.x) - staticWidth / 2;
                const staticY =
                    staticEntity.get(StaticPosition.y) - staticHeight / 2;

                const movingWidth = movingEntity.get(CollisionHitbox.x);
                const movingHeight = movingEntity.get(CollisionHitbox.y);
                const movingX = movingEntity.get(Position.x) - movingWidth / 2;
                const movingY = movingEntity.get(Position.y) - movingHeight / 2;

                const velX = movingEntity.get(Velocity.x);
                const velY = movingEntity.get(Velocity.y);

                if (
                    movingX + movingWidth < staticX ||
                    movingX > staticX + staticWidth ||
                    movingY + movingHeight < staticY ||
                    movingY > staticY + staticHeight
                )
                    return;

                if (movingEntity.has(CollisionHeath)) {
                    movingEntity.inc(CollisionHeath, -1);
                    if (movingEntity.get(CollisionHeath) <= 0) {
                        this.queueForDestroy.add(movingEntity);
                    }

                    return;
                }

                // console.log("collision between", staticEntity, movingEntity);

                // Collision from left of static
                if (
                    movingX + movingWidth > staticX &&
                    movingX + movingWidth - velX <= staticX
                ) {
                    movingEntity.set(Position.x, staticX - movingWidth / 2);
                    movingEntity.mult(
                        Velocity.x,
                        movingEntity.has(BouncinessFactor)
                            ? -movingEntity.get(BouncinessFactor.x)
                            : 0
                    );
                    return;
                } else if (
                    movingX < staticX + staticWidth &&
                    movingX - velX >= staticX + staticWidth
                ) {
                    movingEntity.set(
                        Position.x,
                        staticX + staticWidth + movingWidth / 2
                    );
                    movingEntity.mult(
                        Velocity.x,
                        movingEntity.has(BouncinessFactor)
                            ? -movingEntity.get(BouncinessFactor.x)
                            : 0
                    );
                    return;
                }

                // Collision from top of static
                if (
                    movingY + movingHeight > staticY &&
                    movingY + movingHeight - velY <= staticY
                ) {
                    movingEntity.set(Position.y, staticY - movingHeight / 2);
                    movingEntity.mult(
                        Velocity.y,
                        movingEntity.has(BouncinessFactor)
                            ? -movingEntity.get(BouncinessFactor.y)
                            : 0
                    );
                    if (movingEntity.has(PlayerInfo)) {
                        movingEntity.set(PlayerInfo.canJump, true);
                    }
                } else if (
                    movingY < staticY + staticHeight &&
                    movingY - velY >= staticY + staticHeight
                ) {
                    movingEntity.set(
                        Position.y,
                        staticY + staticHeight + movingHeight / 2
                    );
                    movingEntity.mult(
                        Velocity.y,
                        movingEntity.has(BouncinessFactor)
                            ? -movingEntity.get(BouncinessFactor.y)
                            : 0
                    );
                }
            });
        });

        this.queueForDestroy.forEach((entity) => {
            this.world.destroy(entity);
        });
        this.queueForDestroy.clear();
    }
}
