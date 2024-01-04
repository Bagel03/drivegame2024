import "./polyfills";
import { World } from "bagelecs";
import { LoopPlugin } from "./loop";
import { ScriptPlugin } from "./script";
import { networkConnectionPlugin } from "./multiplayer/network";
import { rollbackPlugin } from "./multiplayer/rollback";
import { StateManagementPlugin } from "./state_managment";
import "./rendering/plugin";

export const enginePlugins = [
    LoopPlugin,
    networkConnectionPlugin,
    rollbackPlugin,
    // MultiplayerInputPlugin,
    // InputPlugin,
    ScriptPlugin,
    StateManagementPlugin,
];
