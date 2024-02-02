import { Application, Container } from "pixi.js";
import { setupPixiCanvas } from "./setup";
import { World, markAsSuperclass } from "bagelecs";
import { GraphicsSystem } from "./system";
import { Diagnostics } from "../diagnostics";
import { AnimationSystem } from "./animation";

export function enablePixiRendering(world: World) {
    const app = new Application({
        autoStart: true,
        width: 256,
        height: 256,
        antialias: false,
        // resolution: 2,
        autoDensity: true,
        resizeTo: window,
        backgroundColor: "rgb(0, 115, 255)",
    });
    world.add(app);
    setupPixiCanvas(world);

    world.createSchedule("render");
    world.addSystem(AnimationSystem, "render");
    world.addSystem(GraphicsSystem, "render");

    let lastTime = Date.now();
    app.ticker.add(() => {
        const now = Date.now();
        Diagnostics.FPS = 1000 / (now - lastTime);
        lastTime = now;

        world.update("render");
    });
}
