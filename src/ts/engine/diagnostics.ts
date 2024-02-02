import { World } from "bagelecs";
import { Pane } from "tweakpane";

(Symbol as any).metadata ??= Symbol.for("Symbol.metadata");

const unit = (unit: string) => (target: any, name: string) => {
    if (!target[(Symbol as any).metadata]) {
        Object.defineProperty(target, Symbol.metadata, {
            value: {},
            enumerable: false,
        });
    }

    target[Symbol.metadata][name] = formatLabel(name) + ` (${unit})`;
};

export class Diagnostics {
    // Rendering FPS (ideally totally handled by pixi)
    static FPS = 0;

    // How long the last tick lasted
    @unit("ms")
    static logicTick = 0;

    static totalEntities = 0;

    // Whether or not artificial lag is being applied
    static artificialLag = false;

    // The latency (received - sent) of the last packet in milliseconds
    @unit("ms")
    static ping = 0;
}

// Turns camelCase into Title Case and returns it
function formatLabel(camelCase: string): string {
    camelCase = camelCase.replace(/([a-z])([A-Z])/g, "$1 $2");
    camelCase = camelCase.replace(/^./, (str) => str.toUpperCase());
    return camelCase;
}

declare global {
    interface ObjectConstructor {
        keys<T>(obj: T): (keyof T)[];
    }
}

export function showDiagnostics(world: World) {
    const pane = world.get(Pane);

    const folder = pane.addFolder({ title: "Stats" });

    Object.keys(Diagnostics).forEach((key) => {
        const label = Diagnostics[Symbol.metadata]?.[key]
            ? (Diagnostics[Symbol.metadata]![key] as string)
            : formatLabel(key);

        switch (typeof Diagnostics[key]) {
            case "boolean":
                folder.addBinding(Diagnostics, key, { label });
                break;
            case "number":
            default:
                folder.addBinding(Diagnostics, key, {
                    label,
                    readonly: true,
                });
        }
    });
}

//@ts-expect-error
window.showDiagnostics = () => showDiagnostics(world);
