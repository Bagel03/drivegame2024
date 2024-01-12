import { Input } from "../../../engine/input/input";
import { Script } from "../../../engine/script";
import { Velocity } from "../../components/velocity";

export const MrGriffinPlayer: Script = function () {
    const input = this.world.get(Input);
    this.update(Velocity.x, input.get("x"));
    this.update(Velocity.y, input.get("y"));
};
