import { World } from "bagelecs";
import { Application } from "pixi.js";
import { Diagnostics } from "./diagnostics";

export let paused = true;
export const DESIRED_FPS = 60;
export const DESIRED_FRAME_TIME = 1000 / DESIRED_FPS;

let lastPhysicsTime = performance.now();
let leftOverTime = 0;
let cancelTimeoutId = 0;

export function runPhysicsUpdate(world: World) {
    cancelTimeoutId = setTimeout(() => runPhysicsUpdate(world), DESIRED_FRAME_TIME);

    const now = performance.now();
    const dt = now - lastPhysicsTime;
    leftOverTime += dt;
    lastPhysicsTime = now;

    // world.tick();
    while (leftOverTime >= DESIRED_FRAME_TIME) {
        const start = performance.now();
        world.tick();
        Diagnostics.logicTick = performance.now() - start;
        leftOverTime -= DESIRED_FRAME_TIME;
    }
}

export function runOffSchedulePhysicsUpdate(world: World, numUpdates: number = 1) {
    pause();
    for (let i = 0; i < numUpdates; i++) {
        world.tick();
        leftOverTime -= DESIRED_FRAME_TIME;
    }
    resume(world);
}

export function LoopPlugin(world: World) {
    // let leftoverTime = 0;
    // About 1fps
    // world.get(Application).ticker.speed = 0.04;
    // setInterval(() => {
    //     const now = performance.now();
    //     const dt = now - lastPhysicsTime;
    //     leftoverTime += dt;
    //     lastPhysicsTime = now;
    //     if (paused) return;
    //     // world.tick();
    //     while (leftoverTime >= DESIRED_FRAME_TIME) {
    //         const start = performance.now();
    //         world.tick();
    //         // console.log(world.archetypeManager.update);
    //         Diagnostics.logicTick = performance.now() - start;
    //         leftoverTime -= DESIRED_FRAME_TIME;
    //     }
    //     // Diagnostics.FPS = 1000 / dt;
    // }, DESIRED_FRAME_TIME);
    // let lastRenderingTime = performance.now();
    // world.get(Application).ticker.add(() => {
    //     world.update("render");
    //     const now = performance.now();
    //     Diagnostics.FPS = 1000 / (now - lastRenderingTime);
    //     lastRenderingTime = now;
    // });
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
    window.clearTimeout(cancelTimeoutId);
    paused = true;
}
export function resume(world: World) {
    lastPhysicsTime = performance.now();
    window.setTimeout(() => runPhysicsUpdate(world), DESIRED_FRAME_TIME);
    paused = false;
}
export function togglePause() {
    paused = !paused;
}
