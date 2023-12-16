import { Entity, System, With, markAsSuperclass } from "bagelecs";
import { Position } from "./position";
import { Application, Container, Graphics } from "pixi.js";

window.container = Container;
window.graphics = Graphics;
markAsSuperclass(Container);

export class GraphicsSystem extends System(With(Container)) {
    init(): void {
        window.gs = this;
    }
    update(): void {
        const stage = this.world.get(Application).stage;

        this.entities.forEachAdded((ent) => {
            const container = ent.get(Container);
            stage.addChild(container);
            console.log("Adding ent", ent);
            container.name = ent.toString();
        });

        this.entities.forEachRemoved((ent) => {
            stage.getChildByName(ent.toString())!.removeFromParent();
            console.log("Removing child", ent);
        });

        // console.log(this.entities);
        this.entities.forEach((ent) => {
            const el = ent.get(Container);
            el.position.set(ent.get(Position.x), ent.get(Position.y));
            el.rotation = ent.get(Position.r);
        });
    }
}
