import { World } from "bagelecs";
import { StateManager } from "../engine/state_managment";
import { Menu } from "./states/menu";

export function StartPlugin(world: World) {
    world.get(StateManager).moveTo(Menu, null);
}
