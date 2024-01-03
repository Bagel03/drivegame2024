import { TypeId } from "bagelecs";
import { Entity } from "bagelecs";
import { World } from "bagelecs";
import { Pane, BindingParams } from "tweakpane";

export function InspectPlugin(world: World) {
    const pane = new Pane();
    world.add(pane);

    pane.element.parentElement!.style.width = "355px";
}

export function inspect(
    entity: Entity,
    component: TypeId,
    title: string,
    params?: BindingParams
) {
    const pane = entity.world.get(Pane);

    // This lib is nice, but we need to make a fake object
    let temp = { x: entity.get(component) };

    const input = pane.addBinding(temp, "x", {
        label: title,
        ...(params || {}),
    });

    input.on("change", (ev) => {
        entity.update(component, ev.value);
    });
}

export function monitor(entity: Entity, component: TypeId, title: string) {
    const pane = entity.world.get(Pane);

    let temp = {
        get x() {
            return entity.get(component);
        },
    };
    pane.addBinding(temp, "x", { label: title, readonly: true });
}
