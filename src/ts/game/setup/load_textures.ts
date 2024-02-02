import { Assets } from "pixi.js";

export async function loadAllTextures() {
    await Assets.load("dist/assets/atlas.json");
    await Assets.load("src/assets/map1bg.png");
}
