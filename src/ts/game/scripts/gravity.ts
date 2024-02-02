import { Script } from "../../engine/script";
import { PlayerInfo } from "../components/player_info";
import { Velocity } from "../components/velocity";

export const gravity: Script = function () {
    this.inc(Velocity.y, PlayerInfo.globals.gravity);
};
