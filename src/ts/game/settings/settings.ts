import { Component, Resource, Type } from "bagelecs";

export class ApplicationSettings {
    readonly aspectRatio!: number;
}

export const Settings = Component(
    Type({
        aspectRatio: Type.number,
        username: Type.string,
    }).logged()
);
