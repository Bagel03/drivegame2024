import { Component, Type } from "bagelecs";

export const Cost = Component(
    Type({
        price: Type.number,
        payTo: Type.entity,
    }).logged()
);
