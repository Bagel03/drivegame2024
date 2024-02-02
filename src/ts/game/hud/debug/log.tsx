import { Logger } from "bagelecs";

function stringifyMaxDepth(obj: any, depth = 1) {
    // recursion limited by depth arg
    if (!obj || typeof obj !== "object") return JSON.stringify(obj);

    let curDepthResult = '"<?>"'; // too deep
    if (depth > 0) {
        curDepthResult = Object.keys(obj)
            .map((key) => {
                let val = stringifyMaxDepth(obj[key], depth - 1);
                if (val === undefined) val = "null";
                return `"${String(key)}": ${val}`;
            })
            .join(", ");
        curDepthResult = `{${curDepthResult}}`;
    }

    return JSON.stringify(JSON.parse(curDepthResult));
}

export const DebugLog: JSX.FC<{}> = (props) => {
    const el = <div className="absolute top-0 left-0 w-16 h-fit"></div>;

    Logger.prototype.log = function (...args: any[]) {
        el.appendChild(
            <div>
                {" "}
                <span style={{ color: this.color }}>[{this.context}]</span>{" "}
                {...args.map((obj) => stringifyMaxDepth(obj, 2))}
            </div>
        );
    };

    window.console.log = function (...args: any[]) {
        Logger.prototype.log.call(
            { context: "Raw Console", color: "black" },
            ...args
        );
    };

    return el;
};
