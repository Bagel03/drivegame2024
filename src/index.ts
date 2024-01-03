// import "./test";
import {
    Type,
    TypeIdBuilder,
    World,
    setDefaultLoggedStorageBufferSize,
} from "bagelecs";
import { editorPlugins } from "./editor/editor";
import { enginePlugins } from "./engine/engine";
import { gamePlugins } from "./game/game";
import { Logger } from "bagelecs";
import { resume } from "./engine/loop";
import "./engine/jsx-runtime";
// import { debug } from "console";

setDefaultLoggedStorageBufferSize(100);
// Logger.prototype.log = function () {};

//@ts-ignore
console.dont = {
    log: () => {},
};

const world = new World(100);
//@ts-ignore
window.world = world;

async function init() {
    for (const plugins of [editorPlugins, enginePlugins, gamePlugins]) {
        for (const plugin of plugins) {
            await plugin(world);
        }
    }

    resume();
}
init();
