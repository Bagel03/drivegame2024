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

type Row<Headers extends string[]> = { [I in Headers[number]]: string };
class Table<const Headers extends string[]> {
    private readonly writeableRows: Row<Headers>[] = [];
    public readonly rows: ReadonlyArray<Row<Headers>> = this.writeableRows;

    private readonly idIndex: number;
    constructor(
        public readonly headers: Headers,
        public readonly idKey: Headers[number],
        public readonly sheet: GoogleSpreadsheetWorksheet
    ) {
        this.idIndex = headers.indexOf(idKey);
        if (this.idIndex === -1) throw new Error(`Invalid idKey ${idKey}`);
    }

    async loadFromDb() {
        await this.sheet.setHeaderRow(this.headers, 0);
        const rows = await this.sheet.getRows();
        this.writeableRows.push(
            ...rows.map((row) => {
                const obj = {} as Row<Headers>;
                this.headers.forEach((key: Headers[number]) => {
                    obj[key] = row.get(key);
                });
                return obj;
            })
        );

        console.log(
            `${green}Loaded ${cyan}${this.rows.length}${green} rows from ${purple}${this.sheet.title}${reset}`
        );
    }

    getRow(id: string): Row<Headers> | undefined {
        return this.writeableRows.find((row) => row[this.idKey] === id);
    }

    addRow(row: Row<Headers>) {
        this.writeableRows.push(row);
        return row;
    }

    async save() {
        await this.sheet.clearRows({ start: 1 });
        await this.sheet.setHeaderRow(this.headers, 0);
        await this.sheet.addRows(this.writeableRows, { insert: false });
        console.log(
            `${green}Saved ${cyan}${this.rows.length}${green} rows for ${purple}${this.sheet.title}${reset}`
        );
    }
}

class DriveGameDB {
    private readonly doc = new GoogleSpreadsheet(
        "1PpiPQG644jLqDzT8I9z1SQP5knQTSeLafe-KSWWzmXU",
        jwt
    );

    public readonly matches!: Table<
        ["id", "player1", "player2", "winner", "trophiesAwarded", "time"]
    >;

    public readonly accounts!: Table<
        [
            "email",
            "fullName",
            "username",
            "wins",
            "totalMatches",
            "trophies",
            "class",
            "classRank",
            "overallRank",
            "isGuest"
        ]
    >;

    async loadInfo() {
        await this.doc.loadInfo();

        //@ts-expect-error
        this.matches = new Table(
            ["id", "player1", "player2", "winner", "trophiesAwarded", "time"],
            "id",
            this.doc.sheetsByTitle["Games"]
        );
        //@ts-expect-error
        this.accounts = new Table(
            [
                "email",
                "fullName",
                "username",
                "wins",
                "totalMatches",
                "trophies",
                "class",
                "classRank",
                "overallRank",
                "isGuest",
            ],
            "email",
            this.doc.sheetsByTitle["Accounts"]
        );
        await this.matches.loadFromDb();
        await this.accounts.loadFromDb();
    }
    // constructor() {
    // }

    // async loadInfo() {
    //     await this.doc.loadInfo();
    //     // for(const sheet of this.doc.sheetsByTitle) {
    //     //     await sheet.loadCells();
    //     //     const headers = sheet.headerValues as string[];
    //     //     const idKey = headers[0];
    //     //     this.tables.set(sheet.title, new Table(headers, idKey, sheet));
    //     // }
    // }

    // getTable<Headers extends string[], Row extends {[I in Headers[number]]: string}>(title: string) {
    //     return this.tables.get(title) as Table<Headers, Row>;
    // }
}

// class DriveGameDB extends GoogleSpreadsheet {
//     constructor() {
//         super("1jaiyl3s9USS-HbPEc-Grg-vQvSBcwdcuUtkQgt9LB3o", jwt);
//     }

//     get accounts() {
//         return this.sheetsByTitle["Accounts"];
//     }

//     get matches() {
//         return this.sheetsByTitle["Games"];
//     }

//     set(row: GoogleSpreadsheetRow, header: string, value: any) {
//         const column = row._worksheet.headerValues.indexOf(header);
//         if (column === -1 || row.rowNumber - 1 <= 0)
//             throw new Error(`Invalid cell row ${row.rowNumber - 1} col ${column}`);
//         // console.log(`Setting ${header} to ${value} in ${row._worksheet.title}`);

//         row._worksheet.getCell(row.rowNumber - 1, column).value = value;
//     }

//     save(worksheet: GoogleSpreadsheetWorksheet) {
//         return worksheet
//             .saveUpdatedCells()
//             .catch((e) => console.error("Error saving db"));
//     }
// }

export const DATABASE = new DriveGameDB();

export const green = "\u001b[32m";
export const reset = "\u001b[0m";
export const cyan = "\u001b[36m";
export const purple = "\u001b[35m";

export const awaitDatabase = new Promise((resolve, reject) => {
    DATABASE.loadInfo()
        .then(() => {
            console.log(`${green}Database loaded${reset}`);
            // console.log(`\u001b[32m  ↳ ${DATABASE.sheetCount} tables:\u001b[.${Object.keys(DATABASE.sheetsByTitle).map(title => )}`);
        })
        .then(resolve)
        .catch((e) => {
            console.log("Error loading database", e);
        });
});
