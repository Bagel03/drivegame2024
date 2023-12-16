import { Application, ICanvas } from "pixi.js";

function PixiCanvasContainer(props: { canvas: ICanvas }) {
    return (
        <div id="screen" className="self-center aspect-square w-full">
            {props.canvas as any}
        </div>
    );
}

export function setupPixiCanvas(app: Application) {
    document.body.appendChild(
        <PixiCanvasContainer canvas={app.view}></PixiCanvasContainer>
    );
}
