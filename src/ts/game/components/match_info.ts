import { Component, Type } from "bagelecs";
import { Players } from "../players";

const playerInfo = Type({
    name: Type.string,
    player: Type.custom<keyof typeof Players>(),
    stats: {
        bulletsShot: Type.number,
        bulletsHit: Type.number,
        bulletsReceived: Type.number,
        ultsUsed: Type.number,
    },
} as const);

export class MatchInfo {
    constructor(
        public info: {
            player1: {
                name: string;
                player: keyof typeof Players;
                stats: {
                    bulletsShot: number;
                    bulletsHit: number;
                    bulletsReceived: number;
                    ultsUsed: number;
                };
            };
            player2: {
                name: string;
                player: keyof typeof Players;
                stats: {
                    bulletsShot: number;
                    bulletsHit: number;
                    bulletsReceived: number;
                    ultsUsed: number;
                };
            };
            duration: number;
            winner: string;
        }
    ) {}
}
