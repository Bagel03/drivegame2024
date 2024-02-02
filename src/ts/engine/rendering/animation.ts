import { Component, System, Type, With } from "bagelecs";
import { Container, Sprite, Texture } from "pixi.js";

export const AnimatedSprite = Component({
    spriteName: Type.string,
    currentFrame: Type.number,
    thisFrameElapsed: Type.number, // Note that both of these are in frames, not ms or seconds
    thisFrameTotal: Type.number,
    frameCount: Type.number,
});

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
                    ent.get(AnimatedSprite.frameCount)
                ) {
                    ent.set(AnimatedSprite.currentFrame, 0);
                }
                const frameName = `${ent.get(AnimatedSprite.spriteName)}_${
                    ent
                        .get(AnimatedSprite.currentFrame)
                        .toString()
                        .padStart(2, "0") as any
                }` as const;

                if (!this.textureCache.has(frameName)) {
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
