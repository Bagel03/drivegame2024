import { Assets } from "pixi.js";

export async function loadAllTextures() {
    await Assets.load("assets/map1bg.png");
}
