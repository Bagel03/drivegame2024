import { Type } from "bagelecs";
import { With } from "bagelecs";
import { BlueprintFactory } from "bagelecs";
import { Blueprint } from "bagelecs";
import { StorageKind } from "bagelecs";
import { System } from "bagelecs";
import { Component } from "bagelecs";
import { World } from "bagelecs";

const world = new World(100);
window.world = world;

const Tracked = Component({
    x: Type.number.logged(),
});
window.t = Tracked;
console.log(Tracked.x);

const BP = BlueprintFactory(new Blueprint(Tracked), Tracked.x);

const ent = BP(1);

class Sys extends System(With(Tracked)) {
    update(): void {
        this.entities.forEach((ent) => ent.inc(Tracked.x, 1));
    }
}

const get = () => ent.get(Tracked.x);
const rollback = (frames: number) =>
    world.storageManager
        .getAllByType(StorageKind.logged)
        .forEach((storage) => storage.rollback(frames));

let currentFrame = 0;
class Sys2 extends System({}) {
    update(): void {
        if (currentFrame == 3) {
            console.log("Rolling back");
            rollback(2);
            console.log(get());
        }
        currentFrame++;
    }
}

world.addSystem(Sys2);

world.addSystem(Sys);

for (let i = 0; i < 10; i++) {
    console.log(i, get());
    world.tick();
}

// console.log(get());
// world.tick();
// world.tick();

// console.log(get());
// world.storageManager
//     .getAllByType(StorageKind.logged)
//     .forEach((storage) => storage.rollback(1));
// console.log(get());
