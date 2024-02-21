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

    // Level 4
    {
        wins: 20,
        prevWins: 45,
    },

    // Level 5
    {
        wins: 30,
        prevWins: 65,
    },

    // Level 6
    {
        wins: 40,
        prevWins: 95,
    },

    // Level 7
    {
        wins: 50,
        prevWins: 135,
    },

    // Level 8 (No ones beating it)
    {
        wins: 1_000_000,
        prevWins: 185,
    },
];

export function totalWinsToLevel(wins: number) {
    let level = Levels.findIndex((level) => level.wins + level.prevWins > wins)!;

    return { level, winsIntoLevel: wins - Levels[level].prevWins };
}
