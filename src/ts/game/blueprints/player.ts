import {
    AdvancedBlueprintFactory,
    Blueprint,
    Component,
    Entity,
    Type,
} from "bagelecs";
import { Sprite, Texture } from "pixi.js";
import { Position } from "../../engine/rendering/position";
import { Velocity } from "../components/velocity";
import { PlayerInfo } from "../components/player_info";
import { CollisionHitbox } from "../components/collision";
import { Funds } from "../components/funds";
import { Players } from "../players";
import { AnimatedSprite } from "../../engine/rendering/animation";
import { PlayerStats } from "../components/player_stats";

export const PlayerIdentifier = Component(Type.string);

const playerBlueprint = new Blueprint(
    Sprite,
    new Position({ x: 0, y: 0, r: 0 }),
    new Velocity({ x: 0, y: 0 }),
    new PlayerInfo({
        canJump: true,
        heath: 100,
        shootCooldown: 0,
        ultPercent: 0,
        ultTimeLeft: 0,
    }),
    new CollisionHitbox({ x: 32, y: 32 }),
    new Funds(0),
    PlayerIdentifier,
    new PlayerStats({
        bulletsShot: 0,
        bulletsHit: 0,
        bulletsReceived: 0,
        ultsUsed: 0,
    })
);

export const Player = AdvancedBlueprintFactory(
    playerBlueprint,
    [Position.x, Position.y],
    function (this: Entity, player: keyof typeof Players) {
        this.set(PlayerIdentifier.id, player);
        this.addScript(Players[player].playerScript);
        const sprite = new Sprite(
            Texture.from(Players[player].spriteName + "-idleright_00.png")
        );
        this.set(sprite);
        sprite.width = 40;
        sprite.height = 32;
        this.add(
            new AnimatedSprite({
                spriteName: Players[player].spriteName + "-idleright",
                currentFrame: 0,
                thisFrameElapsed: 0,
                thisFrameTotal: 10,
                frameCount: 1,
                loops: true,
            })
        );
    }
) as (x: number, y: number, player: keyof typeof Players) => Entity;
