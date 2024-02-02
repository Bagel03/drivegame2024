import { Component, Type } from "bagelecs";

export class Velocity extends Component(
    Type({ x: Type.number, y: Type.number }).logged()
) {
    add(x: number, y: number) {
        this.x += x;
        this.y += y;
    }

    mult(n: number) {
        this.x *= n;
        this.y *= n;
    }
}

export const Friction = Component(Type.number);
