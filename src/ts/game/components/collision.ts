import { Component, Type } from "bagelecs";

export const CollisionHitbox = Component(Type.vec2);

/** For things that should be destroyed when they collide with something */
export const CollisionHeath = Component(Type.number);

/** For things that bounce around when they collide */
export const BouncinessFactor = Component(Type.vec2);

console.log(BouncinessFactor.x, BouncinessFactor.y);
