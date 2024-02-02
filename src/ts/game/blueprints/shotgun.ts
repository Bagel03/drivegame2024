import { AdvancedBlueprintFactory, Blueprint } from "bagelecs";
import { Position } from "../../engine/rendering/position";
import { Velocity } from "../components/velocity";
import { Graphics } from "pixi.js";
import { MissileScript } from "../scripts/missile";
import { ShotgunScript } from "../scripts/shotgun";
import { GroundEnemyInfo } from "../components/ground_enemy";

const missileBlueprint = new Blueprint(
    new Position({ x: 0, r: 0, y: 0 }),
    new Velocity({ x: 0, y: 0 }),
    Graphics
);

export const ShotgunEnt = AdvancedBlueprintFactory(
    missileBlueprint,
    [Position.x, Position.y, Position.r],
    function () {
        const graphics = new Graphics();
        graphics.beginFill("green");
        graphics.arc(0, 0, 15, 0, Math.PI * 2);
        this.add(new GroundEnemyInfo({ shotTimer: 60 }));
        this.addScript(ShotgunScript);
        this.update(graphics);
    }
);
