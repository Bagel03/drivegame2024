import { Class, System, World } from "bagelecs";

export function ResourceUpdaterSystem(resource: Class<{ update(): any }>) {
    return class ResourceUpdater extends System({}) {
        update(): void {
            this.world.get(resource)?.update();
        }
    };
}

export function ResourceUpdaterPlugin<
    T extends {
        new (world: World, ...args: any): { update(): any };
    }
>(
    resource: T,
    addNew?: boolean,
    ...args: ConstructorParameters<T> extends [World, ...infer rest]
        ? rest
        : never
) {
    return async function (world: World) {
        if (addNew) {
            const res = new resource(world, ...args);
            world.add(res);
            // if (typeof res.init === "function") await res.init();
        }
        world.addSystem(ResourceUpdaterSystem(resource));
    };
}
