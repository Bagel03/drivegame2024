import { Component, Type } from "bagelecs";

export const Funds = Component(Type.number.logged());
console.log("Funds are", Funds.id);
