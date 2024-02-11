import { IncomingMessage, ServerResponse } from "http";
import { DATABASE } from "./database.js";
import { JWT, JWTInput } from "google-auth-library";

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
        const jwtStr = url.searchParams.get("jwt");
        if (!jwtStr) {
            res.statusCode = 400;
            res.end("No JWT provided");
            return;
        }
        // decode the JWT
        const jwt = JSON.parse(atob(jwtStr.split(".")[1]));
        const email: string = jwt.email;

        const rows = await DATABASE.accounts.getRows<AccountInfo>();
        const userClass = ["Freshman", "Sophomore", "Junior", "Senior"].reverse()[
            24 - parseInt(email.slice(0, 2))
        ];
        const row =
            rows.find((row) => row.get("email") === email) ||
            (await DATABASE.accounts.addRow(
                {
                    email,
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
                },
                {}
            ));

        console.log("Found row", row.rowNumber);
        res.write(
            JSON.stringify({
                email,
                "full name": jwt.name,
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
