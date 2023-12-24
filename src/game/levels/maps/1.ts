import { World } from "bagelecs";
import { Settings } from "../../settings/settings";
import { Application, Container, Sprite, Texture } from "pixi.js";

export function loadLevel1Map(world: World) {
    document.body.style.background = "#06011f";
    const sprite = new Sprite(Texture.from("assets/map1bg.png"));
    console.log(sprite);
    world.get(Application).stage.addChild(sprite);
    // world.get(Application).view.width =
}
