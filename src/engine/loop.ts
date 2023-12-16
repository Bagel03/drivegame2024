import { World } from "bagelecs";
import { Application } from "pixi.js";
import { Diagnostics } from "./diagnostics";

export let paused = true;
export const desiredFrameRate = 1000 / 60;

export function LoopPlugin(world: World) {
    let leftoverTime = 0;
    // About 1fps
    // world.get(Application).ticker.speed = 0.04;

    let lastPhysicsTime = performance.now();

    setInterval(() => {
        const now = performance.now();
        const dt = now - lastPhysicsTime;
        leftoverTime += dt;
        lastPhysicsTime = now;

        if (paused) return;
        // world.tick();
        while (leftoverTime >= desiredFrameRate) {
            const start = performance.now();
            world.tick();
            Diagnostics.logicTick = performance.now() - start;
            leftoverTime -= desiredFrameRate;
        }
        // Diagnostics.FPS = 1000 / dt;
    }, desiredFrameRate);

    let lastRenderingTime = performance.now();
    world.get(Application).ticker.add(() => {
        const now = performance.now();

        Diagnostics.FPS = 1000 / (now - lastRenderingTime);
        lastRenderingTime = now;
    });

    // world.get(Application).ticker.add(
    //     // This is kinda weird, but dt isn't the number of ms since the last frame, its "realTime / expected"
    //     (dt) => {
    //         if (paused) return;

    //         leftoverTime += dt;
    //         // console.log(dt * world.get(Application).ticker.FPS);

    //         while (leftoverTime >= 1) {
    //             world.tick();
    //             // if (window.nc?.remoteIds.length) debugger;
    //             leftoverTime--;
    //         }
    //     }
    // );
}

export function pause() {
    paused = true;
}
export function resume() {
    paused = false;
}
export function togglePause() {
    paused = !paused;
}
