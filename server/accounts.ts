import { IncomingMessage, ServerResponse } from "http";
import { DATABASE } from "./database.js";
import { GoogleSpreadsheetRow } from "google-spreadsheet";

export interface AccountInfo {
    email: string;
    "full name": string;
    username: string;
    wins: number;
    "total matches": number;
    trophies: number;
    coins: number;
    items: string;
    class: string;
    classRank: number;
    overallRank: number;
}

export const CLASSES = ["Freshman", "Sophomore", "Junior", "Senior"];
export const REVERSED_CLASSES = CLASSES.slice().reverse();

export async function handleAccountRequests(
    req: IncomingMessage,
    res: ServerResponse<IncomingMessage>,
    path: string,
    url: URL
) {
    // Login
    if (path === "/login") {
        const jwtStr = url.searchParams.get("jwt");
        if (!jwtStr) {
            res.statusCode = 404;
            res.end("No JWT provided");
            return;
        }
        const jwt = JSON.parse(atob(jwtStr.split(".")[1]));
        let info = DATABASE.accounts.getRow(jwt.email);

        const isGuest = !jwt.email.endsWith("@catholiccentral.net");
        const klass = isGuest
            ? ""
            : REVERSED_CLASSES[parseInt(jwt.email.slice(0, 2)) - 24] || "";

        const classRank = isGuest
            ? ""
            : DATABASE.accounts.rows.filter((row) => row.class === klass).length + 1;
        const overallRank = isGuest
            ? ""
            : DATABASE.accounts.rows.filter((row) => !Boolean(row.isGuest)).length +
              1;
        if (!info) {
            info = DATABASE.accounts.addRow({
                email: jwt.email,
                fullName: jwt.name,
                username: jwt.given_name + jwt.family_name.slice(0, 1),
                wins: "0",
                totalMatches: "0",
                trophies: "0",
                class: klass,
                classRank: classRank.toString(),
                overallRank: overallRank.toString(),
                isGuest: isGuest.toString(),
            });
        }

        res.write(JSON.stringify(info));
        res.end();
        return;

        // const rows = await DATABASE.accounts.getRows<AccountInfo>();
        // let row!: GoogleSpreadsheetRow<AccountInfo>;

        // if (jwtStr) {
        //     // decode the JWT
        //     const jwt = JSON.parse(atob(jwtStr.split(".")[1]));
        //     let foundRow = rows.find((row) => {
        //         return row.get("email") === jwt.email;
        //     });

        //     // console.log(jwt.email, foundRow?.get("email") || "not found", rows);
        //     if (!foundRow) {
        //         // make a new row
        //         const userClass =
        //             REVERSED_CLASSES[parseInt(jwt.email.slice(0, 2)) - 24] || "";

        //         foundRow = await DATABASE.accounts.addRow({
        //             email: jwt.email,
        //             "full name": jwt.name,
        //             username: jwt.given_name + jwt.family_name.slice(0, 1),
        //             wins: 0,
        //             "total matches": 0,
        //             trophies: 0,
        //             coins: 0,
        //             items: "",
        //             class: userClass,
        //             classRank:
        //                 rows.filter((row) => row.get("class") === userClass).length +
        //                 1,
        //             overallRank: rows.length + 1,
        //         });
        //     }

        //     row = foundRow;
        // }

        // res.write(
        //     JSON.stringify({
        //         email: row.get("email"),
        //         "full name": row.get("full name"),
        //         username: row.get("username"),
        //         wins: row.get("wins"),
        //         "total matches": row.get("total matches"),
        //         trophies: row.get("trophies"),
        //         coins: row.get("coins"),
        //         items: row.get("items"),
        //         class: row.get("class"),
        //         classRank: row.get("classRank"),
        //         overallRank: row.get("overallRank"),
        //     })
        // );
        // res.end();
    }
}
