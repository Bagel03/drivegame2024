import { Entity, System, With, markAsSuperclass } from "bagelecs";
import { Position } from "./position";
import { Application, Container, Graphics, Rectangle } from "pixi.js";

markAsSuperclass(Container);

export class GraphicsSystem extends System(With(Container)) {
    public readonly screen!: Container;

    public readonly screenRect = new Rectangle(0, 0, 256, 256);
    init(): void {
        //@ts-expect-error
        this.screen = this.world.get(Application).stage.getChildAt(0);
    }
    update(): void {
        this.entities.forEachAdded((ent) => {
            const container = ent.get(Container);
            this.screen.addChild(container);
            container.name = ent.toString();
        });

        // console.log(this.entities);
        this.entities.forEach((ent) => {
            const x = ent.get(Position.x);
            const y = ent.get(Position.y);

            if (
                x > this.screenRect.right ||
                x < this.screenRect.left ||
                y < this.screenRect.top ||
                y > this.screenRect.bottom
            ) {
                ent.remove(Container);
                return;
            }

            const el = ent.get(Container);
            el.position.set(ent.get(Position.x), ent.get(Position.y));
            el.rotation = ent.get(Position.r);
        });

        this.entities.forEachRemoved((ent) => {
            this.screen.getChildByName(ent.toString())!.removeFromParent();
        });
    }
}
