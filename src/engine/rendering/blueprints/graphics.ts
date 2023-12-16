import { AdvancedBlueprintFactory, Blueprint, Entity, TypeId } from "bagelecs";
import { Position } from "../position";
import { Application, Container, Graphics, ILineStyleOptions } from "pixi.js";

const graphicsBlueprint = new Blueprint(
    new Position({ x: 0, y: 0, r: 0 }),
    Container
);

type GraphicsMethod =
    | "drawShape"
    | "arc"
    | "arcTo"
    | "beginFill"
    | "beginHole"
    | "beginTextureFill"
    | "bezierCurveTo"
    | "closePath"
    | "drawCircle"
    | "drawEllipse"
    | "drawPolygon"
    | "drawRect"
    | "drawRect"
    | "drawRoundedRect"
    | "drawShape"
    | "endFill"
    | "endHole"
    | "finishPoly"
    | "lineStyle"
    | "lineTextureStyle"
    | "lineTo"
    | "moveTo"
    | "quadraticCurveTo";

type GraphicsInstructions<T extends GraphicsMethod = GraphicsMethod> =
    T extends keyof Graphics
        ? Graphics[T] extends (...args: any[]) => any
            ? Parameters<Graphics[T]>
            : never
        : never;

// type y = GraphicInstructions<""

export const GraphicsEnt = AdvancedBlueprintFactory(
    graphicsBlueprint,
    [Position.x, Position.y],
    function (
        options: GraphicsBlueprintOptions,
        methodName: string | ((graphics: Graphics) => void) | any[],
        ...args: any[]
    ) {
        const graphics = new Graphics();

        if (options.fillStyle) {
            graphics.beginFill(options.fillStyle);
        }
        if (options.lineStyle) {
            graphics.lineStyle(options.lineStyle);
        }

        if (typeof methodName === "function") {
            methodName(graphics);
        } else {
            //@ts-expect-error
            graphics[methodName](...args);
        }

        graphics.position.set(this.get(Position.x), this.get(Position.y));
        this.world.get(Application).stage.addChild(graphics);

        this.update(graphics);
    }
) as {
    <T extends GraphicsMethod>(
        x: number,
        y: number,
        options: GraphicsBlueprintOptions,
        method: T,
        ...args: GraphicsInstructions<T>
    ): Entity;

    (
        x: number,
        y: number,
        options: GraphicsBlueprintOptions,
        fn: (graphics: Graphics) => void
    ): Entity;
};

export interface GraphicsBlueprintOptions {
    fillStyle?: string;
    lineStyle?: ILineStyleOptions;
}

// function test(...instructions: GraphicInstructions<GraphicsMethod>[]) {}

// test(["arc", 1, 2, 3, 4, 5]);
// let x = new Graphics();

// x.drawShape;
