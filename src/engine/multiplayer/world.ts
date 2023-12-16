import { World } from "bagelecs";

export class MultiplayerEntityManager {
    public readonly entities: Int32Array = new Int32Array(1000);
}
export function patchWorldMethods(world: World) {
    const $oldSpawn = world.spawn;
    const $oldDestroy = world.destroy;
}
