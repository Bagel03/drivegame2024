import { IncomingMessage, Server, ServerResponse } from "http";
import { DATABASE } from "./database";
import { CLASSES } from "./accounts";

export function handleMatchmakingRequests(
    req: IncomingMessage,
    res: ServerResponse,
    path: string,
    url: URL
) {
    switch (path) {
        case "/exitQueue":
            handleExitQueue(res, url);
            break;
        case "/enterQueue":
            handleEnterQueue(req, res, path, url);
            break;
        case "/gameOver":
            handleGameOver(req, res, path, url);
            break;
        case "/startGame":
            handleStartGameRequest(res, url);
            break;
        default:
            res.statusCode = 404;
            res.end();
    }
}

let queuedPlayer: {
    response: ServerResponse;
    id: string;
} | null = null;

export function handleExitQueue(res: ServerResponse, url: URL) {
    if (url.searchParams.get("id") == queuedPlayer?.id) {
        queuedPlayer = null;
    }

    res.end();
}

let gamesWaitingToStart = new Map<
    string,
    {
        response?: ServerResponse;
        remoteId?: string;
        id: string;
    }
>();

export function handleEnterQueue(
    req: IncomingMessage,
    res: ServerResponse,
    path: string,
    url: URL
) {
    if (!queuedPlayer) {
        queuedPlayer = {
            response: res,
            id: url.searchParams.get("id")!,
        };
        return;
    }

    const gameId = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    res.write(JSON.stringify({ gameId }));
    queuedPlayer.response.write(JSON.stringify({ gameId }));

    res.end();
    queuedPlayer.response.end();

    queuedPlayer = null;
    gamesWaitingToStart.set(gameId, {
        id: gameId,
    });
}

export function handleStartGameRequest(res: ServerResponse, url: URL) {
    const gameIdWanted = url.searchParams.get("gameId");
    if (!gameIdWanted) {
        res.statusCode = 400;
        res.statusMessage = "No gameId";
        res.end();
        return;
    }

    const game = gamesWaitingToStart.get(gameIdWanted);
    if (!game) {
        res.statusCode = 400;
        res.statusMessage = "Bad gameId";
        res.end();
        return;
    }

    if (!game.response) {
        game.response = res;
        game.remoteId = url.searchParams.get("id")!;

        setTimeout(() => {
            if (gamesWaitingToStart.has(game.id)) {
                res.statusCode = 500;
                res.statusMessage = "Timeout";
                res.end();
                gamesWaitingToStart.delete(game.id);
                return;
            }
        }, 1000 * 5);
        return;
    }

    // Connect them
    game.response.write(
        JSON.stringify({
            remoteId: url.searchParams.get("id"),
            isHost: false,
            gameId: game.id,
        })
    );
    res.write(
        JSON.stringify({ remoteId: game.remoteId, isHost: true, gameId: game.id })
    );

    game.response.end();
    res.end();
    gamesWaitingToStart.delete(game.id);
    console.log(`Game ${game.id} started`);
}

let gamesWaitingToFinish = new Map<
    string,
    { id: string; response: ServerResponse; email: string; winner: string }
>();
export function handleGameOver(
    req: IncomingMessage,
    res: ServerResponse,
    path: string,
    url: URL
) {
    const gameId = url.searchParams.get("gameId");
    if (!gameId) {
        res.statusCode = 404;
        res.statusMessage = "No game provided";
        res.end();
        return;
    }

    if (DATABASE.matches.getRow(gameId)) {
        res.statusCode = 400;
        res.statusMessage = "Match already ended";
        res.end();
        return;
    }

    if (!gamesWaitingToFinish.has(gameId)) {
        gamesWaitingToFinish.set(gameId, {
            response: res,
            id: gameId,
            email: url.searchParams.get("email")!,
            winner: url.searchParams.get("winner")!,
        });
        return;
    }

    const game = gamesWaitingToFinish.get(gameId)!;
    const trophies = Math.round(25 + Math.random() * 10);

    for (const response of [game.response, res]) {
        response.write(
            JSON.stringify({
                trophies,
                winner: game.winner,
            })
        );
        response.end();
    }
    game.response!.end();

    DATABASE.matches.addRow({
        id: gameId,
        player1: game.email,
        player2: url.searchParams.get("email")!,
        trophiesAwarded: trophies.toString(),
        time: "0",
        winner: game.winner,
    });

    console.log(
        `Game ${game.id} ended: ${game.email} v ${url.searchParams.get("email")}: ${
            game.winner
        } +${trophies}🏆 `
    );

    if (game.email === url.searchParams.get("email")) {
        return;
    }

    const player1Row = DATABASE.accounts.getRow(game.email);
    const player2Row = DATABASE.accounts.getRow(url.searchParams.get("email")!);

    if (!player1Row || !player2Row) {
        return;
    }

    const winningRow = game.winner === player1Row.email ? player1Row : player2Row;
    const losingRow = winningRow === player1Row ? player2Row : player1Row;

    winningRow.trophies = (parseInt(winningRow.trophies) + trophies).toString();
    losingRow.trophies = Math.max(
        parseInt(losingRow.trophies) - trophies,
        0
    ).toString();

    winningRow.totalMatches = (parseInt(winningRow.totalMatches) + 1).toString();
    losingRow.totalMatches = (parseInt(losingRow.totalMatches) + 1).toString();

    winningRow.wins = (parseInt(winningRow.wins) + 1).toString();

    reorderRanks();
    // DATABASE.accounts.getRow(game.winner)?.totalMatches
}

function reorderRanks() {
    const allCC = DATABASE.accounts.rows.filter((r) => !r.isGuest);
    allCC.sort((a, b) => parseInt(b.trophies) - parseInt(a.trophies));
    allCC.forEach((row, i) => (row.overallRank = (i + 1).toString()));

    const classRanks = CLASSES.map((c) =>
        DATABASE.accounts.rows.filter((person) => person.class === c)
    ).map((arr) => arr.sort((a, b) => parseInt(b.trophies) - parseInt(a.trophies)));

    classRanks.forEach((people) => {
        people.forEach((person, i) => (person.classRank = (i + 1).toString()));
    });
}
