import { Component, Type } from "bagelecs";
import { monitor } from "../../editor/inspect";
import { NetworkConnection, PeerId } from "../../engine/multiplayer/network";
import { State, StateClass } from "../../engine/state_managment";
import { PlayerInfo, movementScript } from "../scripts/movement";
import { GraphicsEnt } from "../../engine/rendering/blueprints/graphics";
import { Graphics } from "pixi.js";
import { Velocity } from "../components/velocity";
import { MissileEnt } from "../blueprints/missile";
import { ShotgunEnt } from "../blueprints/shotgun";
import { RemoveDeadEntities } from "../systems/timed";

export class Game extends State<never> {
    async onEnter<From extends StateClass<any>>(
        payload: never,
        from: From
    ): Promise<void> {}

    update() {}
    async onLeave() {}
}
