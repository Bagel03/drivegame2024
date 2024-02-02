import { World } from "bagelecs";
import { DESIRED_FRAME_TIME } from "./loop";
import { NetworkConnection } from "./multiplayer/network";

export function awaitFrame(world: World, frame: number) {
    return new Promise<void>((resolve) => {
        const id = setInterval(() => {
            if (world.get(NetworkConnection).framesConnected >= frame) {
                clearInterval(id);
                resolve();
            }
        }, DESIRED_FRAME_TIME / 2);
    });
}
