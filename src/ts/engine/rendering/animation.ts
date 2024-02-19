import { Component, Entity, System, Type, With } from "bagelecs";
import { Container, MIPMAP_MODES, Sprite, Texture } from "pixi.js";
import { Facing } from "../../game/components/facing";

export class AnimatedSprite extends Component({
    spriteName: Type.string,
    currentFrame: Type.number,
    thisFrameElapsed: Type.number, // Note that both of these are in frames, not ms or seconds
    thisFrameTotal: Type.number,
    frameCount: Type.number,
    loops: Type.bool,
}) {
    static changeSprite(
        entity: Entity,
        spriteName: string,
        frameCount: number,
        loops: boolean = true,
        frameLength: number = 10
    ) {
        entity.set(AnimatedSprite.spriteName, spriteName);
        entity.set(AnimatedSprite.currentFrame, 0);
        entity.set(AnimatedSprite.frameCount, frameCount);
        entity.set(AnimatedSprite.loops, loops);
        entity.set(AnimatedSprite.thisFrameTotal, frameLength);
        let dir = entity.has(Facing) ? entity.get(Facing) : "";
        entity.get(Sprite).texture = Texture.from(spriteName + dir + "_00.png");
    }

    static onChangeDirection(entity: Entity) {
        let dir = entity.has(Facing) ? entity.get(Facing) : "";
        let spriteName = entity.get(AnimatedSprite.spriteName);
        entity.get(Sprite).texture = Texture.from(spriteName + dir + "_00.png");
        entity.set(AnimatedSprite.currentFrame, 0);
        entity.set(AnimatedSprite.thisFrameElapsed, 0);
    }
}

export class AnimationSystem extends System(With(Container, AnimatedSprite)) {
    private textureCache = new Map<`${string}_${number}`, Texture>();
    update(): void {
        this.entities.forEach((ent) => {
            ent.inc(AnimatedSprite.thisFrameElapsed);
            if (
                ent.get(AnimatedSprite.thisFrameElapsed) >
                ent.get(AnimatedSprite.thisFrameTotal)
            ) {
                ent.set(AnimatedSprite.thisFrameElapsed, 0);
                ent.inc(AnimatedSprite.currentFrame);

                if (
                    ent.get(AnimatedSprite.currentFrame) >=
                        ent.get(AnimatedSprite.frameCount) &&
                    ent.get(AnimatedSprite.loops)
                ) {
                    ent.set(AnimatedSprite.currentFrame, 0);
                } else {
                    ent.set(
                        AnimatedSprite.currentFrame,
                        Math.min(
                            ent.get(AnimatedSprite.currentFrame),
                            ent.get(AnimatedSprite.frameCount) - 1
                        )
                    );
                }
                const frameName = `${ent.get(AnimatedSprite.spriteName)}${
                    ent.has(Facing) ? ent.get(Facing) : ""
                }_${
                    ent
                        .get(AnimatedSprite.currentFrame)
                        .toString()
                        .padStart(2, "0") as any
                }` as const;

                if (!this.textureCache.has(frameName)) {
                    const texture = Texture.from(frameName + ".png");
                    texture.baseTexture.mipmap = MIPMAP_MODES.ON;
                    this.textureCache.set(
                        frameName,
                        Texture.from(frameName + ".png")
                    );
                }

                ent.get(Sprite).texture = this.textureCache.get(frameName)!;
            }
        });
    }
}
