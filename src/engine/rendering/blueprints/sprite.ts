import { AdvancedBlueprintFactory, Blueprint } from "bagelecs";
import { Position } from "../position";
import { Application, Sprite, Texture } from "pixi.js";

const SpriteBlueprint = new Blueprint(new Position({ x: 0, y: 0, r: 0 }), Sprite);

export const SpriteEnt = AdvancedBlueprintFactory(
    SpriteBlueprint,
    [Position.x, Position.y],
    function (source: string) {
        const sprite = new Sprite(Texture.from(source));
        this.update(sprite);

        sprite.position.set(this.get(Position.x), this.get(Position.y));

        this.world.get(Application).stage.addChild(sprite);
    }
);
