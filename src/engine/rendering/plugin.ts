import { Application, Container } from "pixi.js";
import { setupPixiCanvas } from "./setup";
import { World, markAsSuperclass } from "bagelecs";
import { GraphicsSystem } from "./system";

export function RenderPlugin(world: World) {
    const app = new Application({
        autoStart: true,
        width: 1600,
        height: 900,
        antialias: true,
        // resolution: 2,
        autoDensity: true,
    });
    world.add(app);
    setupPixiCanvas(app);

    world.addSystem(GraphicsSystem);
}
