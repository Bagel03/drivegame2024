import { IncomingMessage, ServerResponse } from "http";
import { DATABASE } from "./database.js";
import { JWT, JWTInput } from "google-auth-library";
import { GoogleSpreadsheetRow } from "google-spreadsheet";

interface AccountInfo {
    email: string;
    "full name": string;
    username: string;
    wins: number;
    "total matches": number;
    trophies: number;
    coins: number;
    items: string;
}

export async function handleAccountRequests(
    req: IncomingMessage,
    res: ServerResponse<IncomingMessage>,
    path: string,
    url: URL
) {
    // Login
    if (path === "/login") {
        const email = url.searchParams.get("email");
        const jwtStr = url.searchParams.get("jwt");
        if (!jwtStr && !email) {
            res.statusCode = 400;
            res.end("No JWT or email provided");
            return;
        }

        const rows = await DATABASE.accounts.getRows<AccountInfo>();
        let row!: GoogleSpreadsheetRow<AccountInfo>;

        if (email) {
            let foundRow = rows.find((row) => row.get("email") === email);
            if (!foundRow) {
                res.statusCode = 404;
                res.end("Account not found");
                return;
            }

            row = foundRow;
            return;
        } else if (jwtStr) {
            // decode the JWT
            console.log("Decoding: ", jwtStr, jwtStr.split(".")[1]);
            const jwt = JSON.parse(atob(jwtStr.split(".")[1]));
            let foundRow = rows.find((row) => row.get("email") === email);
            if (!foundRow) {
                // make a new row
                const userClass =
                    ["Freshman", "Sophomore", "Junior", "Senior"].reverse()[
                        24 - parseInt(jwt.email.slice(0, 2))
                    ] || "";

                foundRow = await DATABASE.accounts.addRow({
                    email: jwt.email,
                    "full name": jwt.name,
                    username: jwt.given_name + jwt.family_name.slice(0, 1),
                    wins: 0,
                    "total matches": 0,
                    trophies: 0,
                    coins: 0,
                    items: "",
                    class: userClass,
                    classRank: 0,
                    overallRank: 0,
                });
            }

            row = foundRow;
        }

        res.write(
            JSON.stringify({
                email,
                "full name": row.get("full name"),
                username: row.get("username"),
                wins: row.get("wins"),
                "total matches": row.get("total matches"),
                trophies: row.get("trophies"),
                coins: row.get("coins"),
                items: row.get("items"),
            })
        );
        res.end();
    }
    console.log(DATABASE.title);
    DATABASE;
}
