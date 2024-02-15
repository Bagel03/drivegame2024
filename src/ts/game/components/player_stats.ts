import { Component, Type } from "bagelecs";

export const PlayerStats = Component(
    Type({
        bulletsShot: Type.number,
        bulletsHit: Type.number,
        bulletsReceived: Type.number,
        ultsUsed: Type.number,
    }).logged()
);
