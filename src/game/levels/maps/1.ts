import { World } from "bagelecs";
import { Settings } from "../../settings/settings";
import { Application, Container, SCALE_MODES, Sprite, Texture } from "pixi.js";
import { resize } from "engine/rendering/resize";

export async function loadLevel1Map(world: World) {
    const app = world.get(Application);
    app.renderer.background.backgroundColor.setValue("#06011f");
    // document.body.style.background = "#06011f";
    const sprite = new Sprite(Texture.from("assets/map1bg.png"));
    console.log(sprite);
    sprite.texture.baseTexture.scaleMode = SCALE_MODES.NEAREST;
    world.get<Container>("screen").addChild(sprite);
    console.log(sprite.texture.baseTexture);
    setTimeout(() => {
        resize(app);
    }, 100); // world.get(Application).view.width =
}
