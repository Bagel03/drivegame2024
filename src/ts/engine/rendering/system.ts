import { Entity, System, With, markAsSuperclass } from "bagelecs";
import { Position, StaticPosition } from "./position";
import { Application, Container, Graphics, Rectangle } from "pixi.js";

markAsSuperclass(Container);

export class GraphicsSystem extends System({
    moving: With(Container, Position),
    static: With(Container, StaticPosition),
}) {
    public readonly screen!: Container;

    public readonly screenRect = new Rectangle(0, 0, 256, 256);
    init(): void {
        //@ts-expect-error
        this.screen = this.world.get(Application).stage.getChildAt(0);
    }

    update(): void {
        // this.entities.forEachAdded((ent) => {
        //     const container = ent.get(Container);
        //     this.screen.addChild(container);
        //     container.name = ent.toString();
        //     console.log("Added", ent);
        // });

        // console.log(this.entities);
        const currentChildren = this.screen.children
            .slice()
            .filter((obj) => !obj.KEEP_ALIVE);
        this.entities.static.forEach((ent) => {
            const el = ent.get(Container);
            const idx = currentChildren.indexOf(el);

            if (idx < 0) {
                this.screen.addChild(el);
                el.name = ent as any;
                // console.log(idx);
            } else {
                currentChildren.splice(idx, 1);
            }
        });

        this.entities.moving.forEach((ent) => {
            const x = ent.get(Position.x);
            const y = ent.get(Position.y);

            // if (
            //     x > this.screenRect.right ||
            //     x < this.screenRect.left ||
            //     y < this.screenRect.top ||
            //     y > this.screenRect.bottom
            // ) {
            //     // This should remove it
            //     return;
            // }

            const el = ent.get(Container);
            const idx = currentChildren.indexOf(el);

            if (idx < 0) {
                this.screen.addChild(el);
                el.name = ent as any;
                // console.log(idx);
            } else {
                currentChildren.splice(idx, 1);
            }

            el.position.set(ent.get(Position.x), ent.get(Position.y));
            el.rotation = ent.get(Position.r);
        });

        currentChildren.forEach((child) => {
            child.removeFromParent();
        });

        // this.entities.forEachRemoved((ent) => {
        //     this.screen.getChildByName(ent.toString())!.removeFromParent();
        // });
    }
}
