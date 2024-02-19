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

        let match = ongoingGames.get(matchId);
        if (!match) {
            ongoingGames.set(matchId, {
                id: matchId,
                players: [clientId],
                playerResults: [winner],
                playerEmails: [clientEmail],
                playerGameOverRes: res,
            });
            match = ongoingGames.get(matchId)!;
        } else {
            match.playerEmails.push(clientEmail);
            match.players.push(clientId);
            match.playerResults.push(winner);

            const trophiesAwarded = 25 + Math.floor(Math.random() * 10);
            const winningId = match.playerResults[0];
            for (const response of [res, match.playerGameOverRes!]) {
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
            const winningRow = rows.find(
                (row) =>
                    row.get("email") ==
                    match!.playerEmails[match!.players.indexOf(winningId)]
            );
            if (!winningRow) {
                console.error(
                    "Couldn't find winning row",
                    match.playerEmails[match.players.indexOf(winningId)]
                );
            } else {
                //@ts-expect-error
                winningRow.assign({
                    trophies: parseInt(winningRow.get("trophies")) + trophiesAwarded,
                    wins: parseInt(winningRow.get("wins")) + 1,
                    "total matches": parseInt(winningRow.get("total matches")) + 1,
                });
                await winningRow.save();
            }

            const losingRow = rows.find(
                (row) =>
                    row.get("email") ==
                    match!.playerEmails[1 - match!.players.indexOf(winningId)]
            )!;
            if (!losingRow) {
                console.error(
                    "Couldn't find losing row",
                    match.playerEmails[1 - match.players.indexOf(winningId)]
                );
            } else {
                //@ts-expect-error
                losingRow.assign({
                    "total matches": parseInt(losingRow.get("total matches")) + 1,
                    trophies: Math.max(
                        parseInt(losingRow.get("trophies")) - trophiesAwarded,
                        0
                    ),
                });
                await losingRow.save();
            }

            await reorderRanks(rows);
            ongoingGames.delete(matchId);
        }

        // match.playerResults[match.players.indexOf(clientId)] = winner;

        // if (match.playerGameOverRes) {
        //     // Make sure they agree
        //     if (match.playerResults[0] == match.playerResults[1]) {
        //         // Can't make it too normal can we 😉
        //         const trophiesAwarded = 25 + Math.floor(Math.random() * 10);
        //         const winningId = match.playerResults[0];

        //         for (const response of [res, match.playerGameOverRes]) {
        //             response.write(
        //                 JSON.stringify({ winner: winningId, trophiesAwarded })
        //             );
        //             response.end();
        //         }

        //         DATABASE.matches.addRow({
        //             id: matchId,
        //             player1: match.playerEmails[0],
        //             player2: match.playerEmails[1],
        //             winner: match.playerEmails[match.players.indexOf(winningId)],
        //             trophiesAwarded,
        //         });

        //         const rows = await DATABASE.accounts.getRows<AccountInfo>();
        //         const winningRow = rows.find(
        //             (row) =>
        //                 row.get("email") ==
        //                 match.playerEmails[match.players.indexOf(winningId)]
        //         )!;

        //         //@ts-expect-error
        //         winningRow.assign({
        //             trophies: winningRow.get("trophies") + trophiesAwarded,
        //             wins: parseInt(winningRow.get("wins")) + 1,
        //             "total matches": parseInt(winningRow.get("total matches")) + 1,
        //         });
        //         winningRow.save();
        //         const losingRow = rows.find(
        //             (row) =>
        //                 row.get("email") ==
        //                 match.playerEmails[1 - match.players.indexOf(winningId)]
        //         )!;
        //         //@ts-expect-error

        //         losingRow.assign({
        //             "total matches": losingRow.get("total matches") + 1,
        //             trophies: Math.max(
        //                 parseInt(losingRow.get("trophies")) - trophiesAwarded,
        //                 0
        //             ),
        //         });

        //         losingRow.save();

        //         console.log(
        //             `Match ${matchId} over: (${winningId}) v ${
        //                 match.players[1 - match.players.indexOf(winningId)]
        //             } - ${trophiesAwarded} trophies`
        //         );

        //         reorderRanks(rows);

        //         ongoingGames.delete(matchId);
        //     } else {
        //         // Ill do this later (to avoid hackers)
        //     }
        // } else {
        //     // Append for later
        //     match.playerGameOverRes = res;

        //     // Set a timeout if we don't get a response in like 10 seconds
        //     setTimeout(async () => {
        //         const trophiesAwarded = 25 + Math.floor(Math.random() * 10);
        //         const winningId = match.playerResults[0];

        //         // If we still haven't gotten a response, assume the 1 user quit and give the other guy the win
        //         if (ongoingGames.has(matchId)) {
        //             DATABASE.matches.addRow({
        //                 id: matchId,
        //                 player1: match.playerEmails[0],
        //                 player2: match.playerEmails[1],
        //                 winner: match.playerEmails[match.players.indexOf(winningId)],
        //                 trophiesAwarded,
        //             });

        //             const rows = await DATABASE.accounts.getRows<AccountInfo>();
        //             const winningRow = rows.find(
        //                 (row) =>
        //                     row.get("email") ==
        //                     match.playerEmails[match.players.indexOf(winningId)]
        //             );

        //             if (!winningRow) {
        //                 console.error(
        //                     "Couldn't find winning row",
        //                     match.playerEmails[match.players.indexOf(winningId)]
        //                 );
        //             }
        //             //@ts-expect-error
        //             winningRow.assign({
        //                 trophies: winningRow.get("trophies") + trophiesAwarded,
        //                 wins: winningRow.get("wins") + 1,
        //                 "total matches": winningRow.get("total matches") + 1,
        //             });
        //             winningRow.save();
        //             const losingRow = rows.find(
        //                 (row) =>
        //                     row.get("email") ==
        //                     match.playerEmails[1 - match.players.indexOf(winningId)]
        //             )!;
        //             //@ts-expect-error

        //             losingRow.assign({
        //                 "total matches": losingRow.get("total matches") + 1,
        //                 trophies: Math.max(
        //                     losingRow.get("trophies") - trophiesAwarded,
        //                     0
        //                 ),
        //             });

        //             losingRow.save();

        //             reorderRanks(rows);

        //             ongoingGames.delete(matchId);

        //             console.log(
        //                 `Match ${matchId} over: (${winningId}) v ${
        //                     match.players[1 - match.players.indexOf(winningId)]
        //                 } (timeout)`
        //             );
        //         }
        //     }, 5000);
        // }
    }
}

function reorderRanks(rows: GoogleSpreadsheetRow<AccountInfo>[]) {
    const promises = [];
    rows.filter((row) => {
        const email = row.get("email");
        return email.endsWith("@catholiccentral.net");
    })
        .sort((a, b) => {
            return b.get("trophies") - a.get("trophies");
        })
        .forEach((row, i) => {
            // @ts-expect-error
            row.assign({ overallRank: i + 1 });
            promises.push(row.save());
        });

    for (const c of classes) {
        const classRows = rows.filter((r) => r.get("class") == c);
        classRows.sort((a, b) => b.get("trophies") - a.get("trophies"));
        for (let i = 0; i < classRows.length; i++) {
            // @ts-expect-error
            classRows[i].assign({ classRank: i + 1 });
            promises.push(classRows[i].save());
        }
    }
    return Promise.all(promises);
}
