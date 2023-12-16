import { AdvancedBlueprintFactory, Blueprint } from "bagelecs";
import { Position } from "../../engine/rendering/position";
import { Velocity } from "../components/velocity";
import { Graphics } from "pixi.js";
import { MissileScript } from "../scripts/missile";

const missileBlueprint = new Blueprint(
    new Position({ x: 0, r: 0, y: 0 }),
    new Velocity({ x: 0, y: 0 }),
    Graphics
);

export const MissileEnt = AdvancedBlueprintFactory(
    missileBlueprint,
    [Position.x, Position.y, Position.r],
    function () {
        const graphics = new Graphics();
        graphics.beginFill("red");
        graphics.drawPolygon(15, 0, -15, 9, -15, -9);
        this.addScript(MissileScript);
        this.update(graphics);
    }
);
