import { Entity, System, With } from "bagelecs";
import { Cost } from "../components/cost";
import { Funds } from "../components/funds";
import { Position } from "../../engine/rendering/position";
import { CollisionHitbox } from "../components/collision";

export class PaymentSystem extends System({
    cost: With(Cost),
    funds: With(Funds),
}) {
    private toRemoveQueue = new Set<Entity>();
    update(): void {
        this.toRemoveQueue.clear();
        this.entities.cost.forEach((costEntity) => {
            this.entities.funds.forEach((fundsEntity) => {
                if (costEntity.get(Cost.payTo) === fundsEntity) return;

                // Check if they are colliding
                if (
                    costEntity.get(Position.x) + costEntity.get(CollisionHitbox.x) <
                        fundsEntity.get(Position.x) ||
                    costEntity.get(Position.x) >
                        fundsEntity.get(Position.x) +
                            fundsEntity.get(CollisionHitbox.x) ||
                    costEntity.get(Position.y) + costEntity.get(CollisionHitbox.y) <
                        fundsEntity.get(Position.y) ||
                    costEntity.get(Position.y) >
                        fundsEntity.get(Position.y) +
                            fundsEntity.get(CollisionHitbox.y)
                )
                    return;
                const funds = fundsEntity.get(Funds);
                console.log("Taking ", costEntity.get(Cost.price), "from", funds);

                fundsEntity.inc(Funds, -Math.min(costEntity.get(Cost.price), funds));
                costEntity.get(Cost.payTo).inc(Funds, costEntity.get(Cost.price));
                this.toRemoveQueue.add(costEntity);
            });
        });
        this.toRemoveQueue.forEach((entity) => {
            this.world.destroy(entity);
        });
    }
}
