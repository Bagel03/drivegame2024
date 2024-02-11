import { Server } from "http";
import { handleAccountRequests } from "./accounts.js";
import { handleMatchmakingRequests } from "./matchmaking.js";

const server = new Server(async (req, res) => {
    try {
        const url = new URL(req.url!, `http://${req.headers.host}`);
        console.log("Request", url.pathname);

        res.setHeader("Access-Control-Allow-Origin", "*");

        if (url.pathname.startsWith("/api/v1")) {
            const path = url.pathname.slice("/api/v1".length);
            console.log(path);
            if (path.startsWith("/accounts")) {
                handleAccountRequests(req, res, path.slice("/accounts".length), url);
            } else if (path.startsWith("/matchmaking")) {
                handleMatchmakingRequests(
                    req,
                    res,
                    path.slice("/matchmaking".length),
                    url
                );
            } else {
                res.statusCode = 404;
                res.end("Not found");
            }
        } else {
            res.statusCode = 400;
            res.end("Bad API version");
        }
    } catch (e) {
        console.error(e);
        res.statusCode = 500;
        res.end("Internal server error");
    }
});

server.listen(8080);
