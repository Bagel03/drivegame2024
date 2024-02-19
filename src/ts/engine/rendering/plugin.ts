import { Application, Container } from "pixi.js";
import { setupPixiCanvas } from "./setup";
import { World, markAsSuperclass } from "bagelecs";
import { GraphicsSystem } from "./system";
import { Diagnostics } from "../diagnostics";
import { AnimationSystem } from "./animation";

export function pixiRenderingPlugin(world: World) {
    const app = new Application({
        autoStart: true,
        width: 256,
        height: 256,
        antialias: false,
        // resolution: 2,
        autoDensity: true,
        resizeTo: window,
        backgroundColor: "#171717",
    });
    const view = app.view as HTMLCanvasElement;
    view.id = "pixi-canvas";
    view.hidden = true;

    view.style.position = "absolute";
    view.style.top = "0";
    view.style.left = "0";

    world.add(app);
    setupPixiCanvas(world);

    world.createSchedule("render");
    world.addSystem(AnimationSystem, "render");
    world.addSystem(GraphicsSystem, "render");

    world.disable(AnimationSystem, "render");
    world.disable(GraphicsSystem, "render");

    let lastTime = Date.now();
    app.ticker.add(() => {
        const now = Date.now();
        Diagnostics.FPS = 1000 / (now - lastTime);
        lastTime = now;

        world.update("render");
    });
}

export function enablePixiRendering(world: World) {
    const view = world.get(Application).view as HTMLCanvasElement;
    if (document.querySelector("#pixi-canvas") == null) {
        document.body.appendChild(view);
    }
    view.hidden = false;

    world.enable(AnimationSystem, "render");
    world.enable(GraphicsSystem, "render");

    // const app = new Application({
    //     autoStart: true,
    //     width: 256,
    //     height: 256,
    //     antialias: false,
    //     // resolution: 2,
    //     autoDensity: true,
    //     resizeTo: window,
    //     backgroundColor: "rgb(0, 115, 255)",
    // });
    // world.add(app);
    // setupPixiCanvas(world);

    // world.createSchedule("render");
    // world.addSystem(AnimationSystem, "render");
    // world.addSystem(GraphicsSystem, "render");

    // let lastTime = Date.now();
    // app.ticker.add(() => {
    //     const now = Date.now();
    //     Diagnostics.FPS = 1000 / (now - lastTime);
    //     lastTime = now;

    //     world.update("render");
    // });
}

export function disablePixiRendering(world: World, hideCanvas = true) {
    if (hideCanvas) {
        (world.get(Application).view as HTMLCanvasElement).hidden = true;
    }

    world.disable(AnimationSystem, "render");
    world.disable(GraphicsSystem, "render");
}
