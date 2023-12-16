import { Component, Type } from "bagelecs";

export const TimedAlive = Component(Type.number.logged());
console.log(TimedAlive.id);
