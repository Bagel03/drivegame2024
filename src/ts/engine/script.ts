import { Type } from "bagelecs";
import { World } from "bagelecs";
import { EntityComponent } from "bagelecs";
import { System } from "bagelecs";
import { Component } from "bagelecs";
import { Entity } from "bagelecs";

export type Script<T = Entity> = {
    (this: T): void;
    init?: (this: T) => void;
    destroy?: (this: T) => void;
    static?: boolean;
};
export const Scripts = Component(Type.custom<Set<Script>>());
export const GlobalScripts = Component(Type.custom<Set<Script<World>>>());
window.s = GlobalScripts;

// Global scripts
declare module "bagelecs" {
    interface World {
        addScript(script: Script<World>): void;
        removeScript(script: Script<World>): void;
        clearScripts(): void;
    }
}

World.prototype.addScript = function (this: World, script) {
    script.init?.apply(this);

    this.get(GlobalScripts).add(script);
};

World.prototype.removeScript = function (script) {
    if (!this.get(GlobalScripts).has(script)) return;
    script.destroy?.apply(this);
    this.get(GlobalScripts).delete(script);
};

World.prototype.clearScripts = function () {
    this.get(GlobalScripts).clear();
};

declare module "bagelecs" {
    interface EntityAPI {
        addScript(script: Script): void;
        removeScript(script: Script): void;
        clearScripts(): void;
    }
}

//@ts-expect-error
Number.prototype.addScript = function (this: Entity, script: Script) {
    if (typeof script.init === "function") {
        script.init.apply(this);
    }

    if (!this.has(Scripts)) {
        this.add(new Scripts(new Set<Script>([script])));
    } else this.get(Scripts).add(script);
};

//@ts-expect-error
Number.prototype.removeScript = function (this: Entity, script: Script) {
    if (!this.has(Scripts))
        throw new Error("Can not remove a script from entity with no scripts");

    script.destroy?.apply(this);

    this.get(Scripts).delete(script);
};

//@ts-expect-error
Number.prototype.clearScripts = function (this: Entity) {
    const scripts = this.get(Scripts);
    if (scripts) {
        scripts.forEach((script) => script.destroy?.apply(this));
    }

    scripts?.clear();
};

export class ScriptSystem extends System(Scripts) {
    init(): void {
        const scripts = new GlobalScripts(new Set());
        this.world.add(scripts);
    }

    update(): void {
        this.entities.forEach((ent) => {
            ent.get(Scripts).forEach((script) => script.apply(ent));
        });

        this.world.get(GlobalScripts).forEach((script) => script.apply(this.world));
    }
}

export const ScriptPlugin = (world: World) => {
    world.addSystem(ScriptSystem);
    world.addToSchedule(ScriptSystem, "rollback");
};
