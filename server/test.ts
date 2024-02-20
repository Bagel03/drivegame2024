import { JWT } from "google-auth-library";
import { GoogleSpreadsheet, GoogleSpreadsheetWorksheet } from "google-spreadsheet";

import creds from "./auth_creds.json";

const SCOPES = [
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/drive.file",
];

const jwt = new JWT({
    email: creds.client_email,
    key: creds.private_key,
    scopes: SCOPES,
});

class DriveGameDB extends GoogleSpreadsheet {
    constructor() {
        super("1jaiyl3s9USS-HbPEc-Grg-vQvSBcwdcuUtkQgt9LB3o", jwt);
    }

    get accounts() {
        return this.sheetsByTitle["Accounts"];
    }

    get matches() {
        return this.sheetsByTitle["Games"];
    }

    save(worksheet: GoogleSpreadsheetWorksheet) {
        worksheet.saveUpdatedCells();
    }
}

export const DATABASE = new DriveGameDB();

export const green = "\u001b[32m";
export const reset = "\u001b[0m";
export const cyan = "\u001b[36m";
export const purple = "\u001b[35m";

export const awaitDatabase = new Promise((resolve, reject) => {
    DATABASE.loadInfo()
        .then(() => {
            console.log(
                [
                    `${green}Database loaded: ${DATABASE.title}${reset}`,
                    `${green}\t↳ Loaded ${cyan}${DATABASE.sheetCount}${green} tables:${reset}`,
                    ...Object.keys(DATABASE.sheetsByTitle).map(
                        (title) =>
                            `\t\t↳ ${purple}${title}${reset} (${cyan}${DATABASE.sheetsByTitle[title].sheetId}${reset}) - ${cyan}${DATABASE.sheetsByTitle[title].rowCount}${reset} rows`
                    ),
                ].join("\n")
            );
            // console.log(`\u001b[32m  ↳ ${DATABASE.sheetCount} tables:\u001b[.${Object.keys(DATABASE.sheetsByTitle).map(title => )}`);
        })
        .then(resolve)
        .catch((e) => {
            console.log("Error loading database", e.name);
        });
});
