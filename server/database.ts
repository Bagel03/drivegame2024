import { JWT } from "google-auth-library";
import {
    GoogleSpreadsheet,
    GoogleSpreadsheetRow,
    GoogleSpreadsheetWorksheet,
} from "google-spreadsheet";

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

    set(row: GoogleSpreadsheetRow, header: string, value: any) {
        const column = row._worksheet.headerValues.indexOf(header);
        if (column === -1 || row.rowNumber - 1 <= 0)
            throw new Error(`Invalid cell row ${row.rowNumber - 1} col ${column}`);
        // console.log(`Setting ${header} to ${value} in ${row._worksheet.title}`);

        row._worksheet.getCell(row.rowNumber - 1, column).value = value;
    }

    save(worksheet: GoogleSpreadsheetWorksheet) {
        return worksheet
            .saveUpdatedCells()
            .catch((e) => console.error("Error saving db"));
    }
}

export const DATABASE = new DriveGameDB();

export const green = "\u001b[32m";
export const reset = "\u001b[0m";
export const cyan = "\u001b[36m";
export const purple = "\u001b[35m";

export const awaitDatabase = new Promise((resolve, reject) => {
    DATABASE.loadInfo()
        .then(() => DATABASE.sheetsByTitle["Accounts"].loadCells())
        .then(() => DATABASE.sheetsByTitle["Games"].loadCells())
        .then(() => {
            console.log(
                [
                    `${green}Database loaded: ${DATABASE.title}${reset}`,
                    `${green}\t↳ Loaded ${cyan}${DATABASE.sheetCount}${green} tables:${reset}`,
                    ...Object.keys(DATABASE.sheetsByTitle).map(
                        (title) =>
                            `\t\t↳ ${purple}${title}${reset} (${cyan}${DATABASE.sheetsByTitle[title].sheetId}${reset}) - ${cyan}${DATABASE.sheetsByTitle[title].cellStats.loaded}${reset} cells loaded`
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
