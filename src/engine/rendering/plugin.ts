import { Application, Container } from "pixi.js";
import { setupPixiCanvas } from "./setup";
import { World, markAsSuperclass } from "bagelecs";
import { GraphicsSystem } from "./system";

export function RenderPlugin(world: World) {
    const app = new Application({
        autoStart: true,
        width: 256,
        height: 256,
        antialias: false,
        // resolution: 2,
        autoDensity: true,
    });
    world.add(app);
    setupPixiCanvas(app);

    world.addSystem(GraphicsSystem);
}
