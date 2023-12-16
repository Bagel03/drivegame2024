import { World } from "bagelecs";
import { MovementPlugin } from "./movement";
// import { CollisionPlugin } from "./collision";
import { StartPlugin } from "./start";

export const gamePlugins: ((world: World) => void)[] = [
    MovementPlugin,
    // CollisionPlugin,
    StartPlugin,
];
