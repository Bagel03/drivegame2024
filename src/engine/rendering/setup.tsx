import { World } from "bagelecs";
import { Application, Container, Graphics, ICanvas } from "pixi.js";
import { resize } from "./resize";

// function PixiCanvasContainer(props: { canvas: ICanvas }) {
//     return props.canvas as unknown as Node;
// }

export function setupPixiCanvas(world: World) {
    const app = world.get(Application);
    document.body.appendChild(app.view as any);

    const screen = new Container();
    screen.sortableChildren = true;
    // const screen = new Graphics();
    // screen.beginFill("rgb(16, 205, 126)");
    // screen.drawRect(0, 0, 256, 256);
    // screen.endFill();

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
