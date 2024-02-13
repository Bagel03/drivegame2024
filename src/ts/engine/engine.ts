import "./polyfills";
import { World } from "bagelecs";
import { LoopPlugin } from "./loop";
import { ScriptPlugin } from "./script";
import { networkConnectionPlugin } from "./multiplayer/network";
import { rollbackPlugin } from "./multiplayer/rollback";
import { StateManagementPlugin } from "./state_managment";
import "./rendering/plugin";
import { MultiplayerInputPlugin } from "./multiplayer/multiplayer_input";
import { ServerConnectionPlugin } from "./server";
import { pixiRenderingPlugin } from "./rendering/plugin";

export const enginePlugins = [
    LoopPlugin,
    ServerConnectionPlugin,
    networkConnectionPlugin,
    rollbackPlugin,
    MultiplayerInputPlugin,
    // InputPlugin,
    ScriptPlugin,
    pixiRenderingPlugin,
    StateManagementPlugin,
];
