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
// import { debug } from "console";

setDefaultLoggedStorageBufferSize(100);
// Logger.prototype.log = function () {};

if (typeof SharedArrayBuffer === "undefined") {
    //@ts-ignore
    window.SharedArrayBuffer = ArrayBuffer;
}

window.addEventListener("error", (e) => {
    document.body.innerHTML = `<pre>${JSON.stringify(e)}</pre>`;
});

const world = new World(100);
//@ts-ignore
window.world = world;

async function init() {
    for (const plugins of [editorPlugins, enginePlugins]) {
        for (const plugin of plugins) {
            await plugin(world);
        }
    }
    world.get(StateManager).moveTo(Login, null);
    resume();
}
init();
