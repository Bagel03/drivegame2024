import "./polyfills";
import { World } from "bagelecs";
import { RenderPlugin } from "./rendering/plugin";
import { LoopPlugin } from "./loop";
import { InputPlugin } from "./input/input";
import { ScriptPlugin } from "./script";
import { networkConnectionPlugin } from "./multiplayer/network";
import { rollbackPlugin } from "./multiplayer/rollback";
import { diagnosticsPlugin } from "./diagnostics";
import { StateManagementPlugin } from "./state_managment";
import { MultiplayerInputPlugin } from "./multiplayer/multiplayer_input";

export const enginePlugins = [
    RenderPlugin,
    LoopPlugin,
    networkConnectionPlugin,
    rollbackPlugin,
    MultiplayerInputPlugin,
    // InputPlugin,
    ScriptPlugin,
    StateManagementPlugin,
    diagnosticsPlugin,
];
