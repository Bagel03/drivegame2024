import { Application, ICanvas } from "pixi.js";

function PixiCanvasContainer(props: { canvas: ICanvas }) {
    return (
        <div
            id="screen"
            className=" w-screen h-screen flex items-center justify-center"
        >
            {props.canvas as any}
        </div>
    );
}

export function setupPixiCanvas(app: Application) {
    document.body.appendChild(
        <PixiCanvasContainer canvas={app.view}></PixiCanvasContainer>
    );

    resize(app);
    window.addEventListener("resize", () => {
        resize(app);
    });
}

function resize(app: Application) {
    const view: HTMLCanvasElement = app.view as any;

    const min = Math.min(
        document.documentElement.clientWidth,
        document.documentElement.clientHeight
    );
    console.log(min);
    view.style.width = view.style.height = min + "px";
    view.style.imageRendering = "pixelated";
}
