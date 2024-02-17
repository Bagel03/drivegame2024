import { IncomingMessage, ServerResponse } from "http";
import { DATABASE } from "./database";
import { AccountInfo, classes } from "./accounts";
import { GoogleSpreadsheetRow } from "google-spreadsheet";

let queuedPlayer: {
    res: ServerResponse;
    id: string;
    email: string;
} | null = null;

interface MatchInfo {
    id: string;
    players: string[];
    playerEmails: string[];
    playerResults: string[];
    playerGameOverRes?: ServerResponse;
}

const ongoingGames = new Map<string, MatchInfo>();

export async function handleMatchmakingRequests(
    req: IncomingMessage,
    res: ServerResponse,
    path: string,
    url: URL
) {
    if (path.startsWith("/enterQueue")) {
        if (queuedPlayer) {
            // Connect them
            const incomingId = url.searchParams.get("id")!;
            const email = url.searchParams.get("email")!;

            const match: MatchInfo = {
                id: `${Date.now()}-${queuedPlayer.id}v${incomingId}`,
                players: [queuedPlayer.id, incomingId],
                playerResults: [],
                playerEmails: [queuedPlayer.email, email],
            };

            ongoingGames.set(match.id, match);

            res.write(
                JSON.stringify({
                    remoteId: queuedPlayer.id,
                    isHost: false,
                    matchId: match.id,
                })
            );
            queuedPlayer.res.write(
                JSON.stringify({
                    remoteId: incomingId,
                    isHost: true,
                    matchId: match.id,
                })
            );

            res.end();
            queuedPlayer.res.end();
            queuedPlayer = null;
        } else {
            queuedPlayer = {
                res,
                id: url.searchParams.get("id")!,
                email: url.searchParams.get("email")!,
            };
        }

        return;
    }

    if (path.startsWith("/exitQueue")) {
        if (queuedPlayer && queuedPlayer.id == url.searchParams.get("id")) {
            queuedPlayer = null;
        } else {
            console.warn("Got message to exit queue from user not in queue");
        }

        return;
    }

    if (path.startsWith("/clearQueue") && url.searchParams.get("user") == "admin") {
        queuedPlayer = null;
        return;
    }

    if (path.startsWith("/gameOver")) {
        const matchId = url.searchParams.get("matchId")!;
        const clientId = url.searchParams.get("id")!;
        const clientEmail = url.searchParams.get("email")!;
        const winner = url.searchParams.get("winner")!;

        const match = ongoingGames.get(matchId);
        if (!match) {
            res.writeHead(400);
            res.end();
            return;
        }

        match.playerResults[match.players.indexOf(clientId)] = winner;

        if (match.playerGameOverRes) {
            // Make sure they agree
            if (match.playerResults[0] == match.playerResults[1]) {
                // Can't make it too normal can we 😉
                const trophiesAwarded = 28 + Math.floor(Math.random() * 5);
                const winningId = match.playerResults[0];

                for (const response of [res, match.playerGameOverRes]) {
                    response.writeHead(200);
                    response.write(
                        JSON.stringify({ winner: winningId, trophiesAwarded })
                    );
                    response.end();
                }

                DATABASE.matches.addRow({
                    id: matchId,
                    player1: match.playerEmails[0],
                    player2: match.playerEmails[1],
                    winner: match.playerEmails[match.players.indexOf(winningId)],
                    trophiesAwarded,
                });

                const rows = await DATABASE.accounts.getRows<AccountInfo>();
                const winningRow =
                    rows[
                        rows.findIndex(
                            (row) =>
                                row.get("email") ==
                                match.playerEmails[match.players.indexOf(winningId)]
                        )
                    ]!;
                //@ts-expect-error
                winningRow.assign({
                    trophies: winningRow.get("trophies") + trophiesAwarded,
                    wins: winningRow.get("wins") + 1,
                    "total matches": winningRow.get("total matches") + 1,
                });
                const losingRow = rows.find(
                    (row) =>
                        row.get("email") ==
                        match.playerEmails[1 - match.players.indexOf(winningId)]
                )!;
                //@ts-expect-error

                losingRow.assign({
                    "total matches": losingRow.get("total matches") + 1,
                    trophies: Math.max(
                        losingRow.get("trophies") - trophiesAwarded,
                        0
                    ),
                });

                console.log(
                    `Match ${matchId} over: (${winningId}) v ${
                        match.players[1 - match.players.indexOf(winningId)]
                    }`
                );

                reorderRanks(rows);
                await DATABASE.accounts.saveUpdatedCells();

                ongoingGames.delete(matchId);
            } else {
                // Ill do this later (to avoid hackers)
            }
        } else {
            // Append for later
            match.playerGameOverRes = res;

            // Set a timeout if we don't get a response in like 10 seconds
            setTimeout(() => {
                // If we still haven't gotten a response, assume the 1 user quit and give the other guy the win
                if (ongoingGames.has(matchId)) {
                    const winningId = match.playerResults[0];
                    const trophiesAwarded = 28 + Math.floor(Math.random() * 5);

                    res.writeHead(200);
                    res.write(
                        JSON.stringify({ winner: winningId, trophiesAwarded })
                    );
                    DATABASE.matches.addRow({
                        id: matchId,
                        player1: match.playerEmails[0],
                        player2: match.playerEmails[1],
                        winner: match.playerEmails[match.players.indexOf(winningId)],
                        trophiesAwarded,
                    });
                    res.end();

                    console.log(
                        `Match ${matchId} over: (${winningId}) v ${
                            match.players[1 - match.players.indexOf(winningId)]
                        } (timeout)`
                    );
                }
            }, 5000);
        }
    }
}

function reorderRanks(rows: GoogleSpreadsheetRow<AccountInfo>[]) {
    rows.sort((a, b) => {
        return b.get("trophies") - a.get("trophies");
    });

    for (let i = 0; i < rows.length; i++) {
        // @ts-expect-error
        rows[i].assign({ overallRank: i + 1 });
    }

    for (const c of classes) {
        const classRows = rows.filter((r) => r.get("class") == c);
        classRows.sort((a, b) => b.get("trophies") - a.get("trophies"));
        for (let i = 0; i < classRows.length; i++) {
            // @ts-expect-error
            classRows[i].assign({ classRank: i + 1 });
        }
    }
}
