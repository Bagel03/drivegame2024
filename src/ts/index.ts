// import "./test";
import {
    Type,
    TypeIdBuilder,
    World,
    setDefaultLoggedStorageBufferSize,
} from "bagelecs";
import { editorPlugins } from "./editor/editor";
import { enginePlugins } from "./engine/engine";
import { Logger } from "bagelecs";
import { resume } from "./engine/loop";
import "./engine/jsx-runtime";
import { StateManager } from "./engine/state_managment";
import { Login } from "./game/states/login";
import { Menu } from "./game/states/menu";
import { ChooseGameMode } from "./game/states/choose";
import { Preload } from "./game/states/preload";

// Logger.prototype.log = function () {};

//@ts-ignore
window.SharedArrayBuffer = ArrayBuffer;

Object.defineProperty(Error.prototype, "toJSON", {
    value: function () {
        const alt: Record<string, any> = {};

        Object.getOwnPropertyNames(this).forEach((key) => {
            alt[key] = this[key];
        });

        return alt;
    },
    configurable: true,
    writable: true,
});

window.addEventListener("error", (e) => {
    document.body.innerHTML = `<pre>Uncaught error: ${JSON.stringify(
        e.error,
        undefined,
        4
    )}</pre>`;
});

const world = new World(100);

//@ts-ignore
window.world = world;

declare global {
    interface Window {
        readonly DIST_URL: string;
    }
}

async function init() {
    for await (const plugins of [editorPlugins, enginePlugins]) {
        for await (const plugin of plugins) {
            await plugin(world);
        }
    }
    await world.get(StateManager).moveTo(Preload, { gameMode: "solo", map: "1" });
    resume(world);
}
init();
