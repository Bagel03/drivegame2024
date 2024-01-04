import { Application, Container } from "pixi.js";
import { setupPixiCanvas } from "./setup";
import { World, markAsSuperclass } from "bagelecs";
import { GraphicsSystem } from "./system";

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
    world.addSystem(GraphicsSystem, "render");

    app.ticker.add(() => {
        world.update("render");
    });
}
