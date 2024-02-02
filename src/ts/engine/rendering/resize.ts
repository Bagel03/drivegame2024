import { Application, Container } from "pixi.js";

export class FixedSizeContainer extends Container {
    constructor(public fixedWidth: number, public fixedHeight: number) {
        super();
    }

    get fixedAspectRatio() {
        return this.fixedWidth / this.fixedHeight;
    }

    fitToScreen(width: number, height: number) {
        // const minX = this.children.reduce(
        //     (min, child) => Math.min(min, child.x),
        //     Infinity
        // );
        // const minY = this.children.reduce(
        //     (min, child) => Math.min(min, child.y),
        //     Infinity
        // );

        if (width / height > this.fixedAspectRatio) {
            this.scale.x = this.scale.y = height / this.fixedHeight;
        } else {
            this.scale.x = this.scale.y = width / this.fixedWidth;
        }

        this.x = (width - this.fixedWidth * this.scale.x) / 2; //+ minX;
        this.y = (height - this.fixedHeight * this.scale.y) / 2;
    }
}

export function resize(app: Application) {
    console.log("Resizing");
    const view: HTMLCanvasElement = app.view as any;
    const screen = app.stage.getChildAt(0) as FixedSizeContainer;
    app.resize();

    screen.fitToScreen(view.width, view.height);
    // const screenAspect = screen.fixedAspectRatio;
    // //creen.width / screen.height;
    // const viewAspect = view.width / view.height;

    // if (screenAspect > viewAspect) {
    //     screen.width = view.width;
    //     screen.scale.y = screen.scale.x;
    // } else {
    //     screen.height = view.height;
    //     screen.scale.x = screen.scale.y;
    // }

    // screen.x = (view.width - screen.width) / 2;
    // screen.y = (view.height - screen.height) / 2;

    // view.style.imageRendering = "pixelated";
}
