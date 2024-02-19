import { World } from "bagelecs";
import { Application, Container, Graphics, ICanvas, Sprite, Texture } from "pixi.js";
import { FixedSizeContainer, resize } from "./resize";

import * as pixi from "pixi.js";
window.pixi = pixi;
// function PixiCanvasContainer(props: { canvas: ICanvas }) {
//     return props.canvas as unknown as Node;
// }

export function setupPixiCanvas(world: World) {
    const app = world.get(Application);
    document.body.appendChild(app.view as any);

    const screen = new FixedSizeContainer((1000 * 19) / 9, 1000);
    // const screen = new FixedSizeContainer(256, 256);
    screen.sortableChildren = true;
    // const screen = new Graphics();
    // screen.beginFill("rgb(16, 205, 126)");
    // screen.drawRect(0, 0, 256, 256);
    // screen.endFill();
    const sprite = new Sprite(
        Texture.from(window.DIST_URL + "/assets/background.jpg")
    );
    sprite.KEEP_ALIVE = true;
    sprite.width = (1000 * 19) / 9;
    sprite.height = 1000;
    world.add(sprite.width, "screenWidth");
    world.add(sprite.height, "screenHeight");
    sprite.zIndex = -1;
    screen.addChild(sprite);

    world.add(screen, "screen");

    // screen.width = 256;
    // screen.height = 256;
    app.stage.addChild(screen);

    resize(app);

    window.addEventListener("resize", () => {
        resize(app);
    });

    // screen.addEventListener("childAdded", () => resize(app));
}
