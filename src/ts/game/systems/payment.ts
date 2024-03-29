import { Entity, System, With } from "bagelecs";
import { Cost } from "../components/cost";
import { Funds } from "../components/funds";
import { Position } from "../../engine/rendering/position";
import { CollisionHitbox } from "../components/collision";
import { PlayerInfo } from "../components/player_info";
import { PlayerStats } from "../components/player_stats";

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
                        fundsEntity.get(Position.x) -
                            fundsEntity.get(CollisionHitbox.x) / 2 ||
                    costEntity.get(Position.x) >
                        fundsEntity.get(Position.x) +
                            fundsEntity.get(CollisionHitbox.x) / 2 ||
                    costEntity.get(Position.y) + costEntity.get(CollisionHitbox.y) <
                        fundsEntity.get(Position.y) -
                            fundsEntity.get(CollisionHitbox.y) / 2 ||
                    costEntity.get(Position.y) >
                        fundsEntity.get(Position.y) +
                            fundsEntity.get(CollisionHitbox.y) / 2
                )
                    return;
                const funds = fundsEntity.get(Funds);

                fundsEntity.inc(Funds, -Math.min(costEntity.get(Cost.price), funds));
                costEntity.get(Cost.payTo).inc(Funds, costEntity.get(Cost.price));
                if (fundsEntity.has(PlayerStats))
                    fundsEntity.inc(PlayerStats.bulletsReceived);

                const payTo = costEntity.get(Cost.payTo);
                if (payTo.has(PlayerInfo) && !payTo.get(PlayerInfo.inUlt)) {
                    payTo.inc(PlayerInfo.ultPercent, 10);
                    payTo.set(
                        PlayerInfo.ultPercent,
                        Math.min(payTo.get(PlayerInfo.ultPercent), 100)
                    );
                }

                payTo.inc(PlayerStats.bulletsHit);

                this.toRemoveQueue.add(costEntity);
            });
        });
        this.toRemoveQueue.forEach((entity) => {
            this.world.destroy(entity);
        });
    }
}
