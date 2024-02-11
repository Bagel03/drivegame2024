export interface LevelDescriptor {
    wins: number;
    prevWins: number;
}

export const Levels: LevelDescriptor[] = [
    // Level 1
    {
        wins: 5,
        prevWins: 0,
    },

    // Level 2
    {
        wins: 10,
        prevWins: 5,
    },

    // Level 3
    {
        wins: 10,
        prevWins: 15,
    },

    // Level 3
    {
        wins: 20,
        prevWins: 25,
    },
];

export function totalWinsToLevel(wins: number) {
    let level = Levels.findIndex((level) => level.wins + level.prevWins > wins)!;

    return { level, winsIntoLevel: wins - Levels[level].prevWins };
}
