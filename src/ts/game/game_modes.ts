import { World } from "bagelecs";
import { NetworkConnection } from "../engine/multiplayer/network";

export interface GameModeInfo {
    name: string;
    description: string;
    icon: string;
    /** Returns true if it is available, if not it returns a string explaining why not */
    getIsAvailable: (world: World) => string | true;
}

export const GameModes = {
    solo: {
        name: "Solo",
        description: "Defeat AI enemies in different arenas to win",
        icon: "fa-person-running",

        getIsAvailable: (world: World): string | true =>
            world.get(NetworkConnection).isConnected
                ? "Party size is too large"
                : true,
    },
    localPvP: {
        name: "Friendly Battle",
        description: "Fight against the other player in your party",
        icon: "fa-user-group",
        getIsAvailable: (world: World): string | true =>
            world.get(NetworkConnection).isConnected
                ? true
                : "Party size is too small",
    },
    onlinePvP: {
        name: "Online Battle",
        description: "Fight against other players through online matchmaking",
        icon: "fa-globe",
        getIsAvailable: (world: World): string | true =>
            world.get(NetworkConnection).isConnected
                ? "Party size is too large"
                : true,
    },
    COOP: {
        name: "CO - OP",
        description: "Work together with your party to defeat AI enemies",
        icon: "fa-people-arrows",
        getIsAvailable: (world: World): string | true =>
            world.get(NetworkConnection).isConnected
                ? "CO - OP is coming soon!"
                : "Party size is too small",
    },
};
