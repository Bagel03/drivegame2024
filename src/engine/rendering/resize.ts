import { Application, Container } from "pixi.js";

export function resize(app: Application) {
    console.log("Resizing");
    const view: HTMLCanvasElement = app.view as any;
    const screen = app.stage.getChildAt(0) as Container;
    app.resize();

    const screenAspect = screen.width / screen.height;
    const viewAspect = view.width / view.height;

    if (screenAspect > viewAspect) {
        screen.width = view.width;
        screen.scale.y = screen.scale.x;
    } else {
        screen.height = view.height;
        screen.scale.x = screen.scale.y;
    }

    screen.x = (view.width - screen.width) / 2;
    screen.y = (view.height - screen.height) / 2;

    view.style.imageRendering = "pixelated";
}
