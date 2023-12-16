import { System } from "bagelecs";
import { Type } from "bagelecs";
import { Component } from "bagelecs";
import { World } from "bagelecs";
import { DataConnection, LogLevel, Peer, PeerConnectOption } from "peerjs";
import { Diagnostics } from "../diagnostics";
import { pause, resume } from "../loop";
import { Application, Ticker } from "pixi.js";
import { ResourceUpdaterPlugin } from "../resource";

export const PeerId = Component(Type.string);

export type DataPacket<T = any> = {
    event: string;
    data: T;
    frame: number;
    timestamp: number;
    id: string;
};

export class NetworkConnection {
    private readonly peer: Peer;

    public readonly connections = new Map<string, DataConnection>();
    public readonly remoteIds: string[] = [];

    public readonly newConnectionListeners = new Set<
        (connection: DataConnection) => void
    >();
    public readonly dataListeners = new Set<
        (data: any, connection: DataConnection) => void
    >();

    public readonly timeConnectedTo: Record<string, number> = {};

    public readonly id!: string;
    public readonly shortenedId: string;

    private readyTrigger!: () => void;
    private readonly readyPromise = new Promise<void>((res, rej) => {
        this.readyTrigger = res;
    });

    private readonly newMessageQueue = new Set<DataPacket>();
    public readonly newMessagesByType = new Map<string, Set<DataPacket>>();

    awaitReady() {
        return this.readyPromise;
    }

    constructor(public world: World) {
        this.shortenedId = String.fromCharCode(
            ...new Array(5).fill(0).map((_) => Math.floor(Math.random() * 26) + 65)
        );
        this.peer = new Peer(`BAGEL-TEST-${this.shortenedId}`, {
            debug: LogLevel.All,
            logFunction(logLevel, ...rest) {
                console.log(...rest);
            },
        });
        this.init();
    }

    private init() {
        this.peer.on("open", (id) => {
            //@ts-ignore
            this.id = id;
            this.readyTrigger();
        });

        this.peer.on("connection", (c) => {
            console.log("Connected to", c.peer, "(Initiated remotely)");

            this.setupConnection(c, true);
            // Find amount of time it takes to send a message, *5, send that time, once you

            // Respond to start counter
            // setTimeout(() => {
            //     console.log("Sending");
            //     c.send({
            //         event: "ConnectionAcknowledged",
            //     });
            //     this.setupConnection(c, true);
            // }, 300);

            // setTimeout(() => {
            //     c.send({
            //         event: "ConnectionAcknowledged",
            //         timestamp: Date.now(),
            //     });

            //     console.log("Sent Connection acknowledged");

            //     const startCb = (data: any) => {
            //         console.log("Got data");
            //         if (data.event === "StartTime") {
            //             console.log("Starting at " + data.startTime);
            //             setTimeout(
            //                 () => this.setupConnection(c, true),
            //                 data.startTime - Date.now()
            //             );
            //             c.removeListener("data", startCb);
            //         }
            //     };

            //     c.on("data", startCb);
            // }, 300);
        });
    }
    private onData<T = any>(
        connection: DataConnection,
        fn: (data: DataPacket<T>) => void
    ) {
        connection.on("data", fn as any);
    }

    private lastFramesReceived: Record<string, number> = {};
    private canResetStats: boolean = false;

    private onDataListener(connection: DataConnection, data: DataPacket) {
        if (this.lastFramesReceived[connection.peer] > data.frame) {
            console.warn("Got out of order packets");
        }

        if (this.canResetStats) {
            Diagnostics.worstRemotePing = -Infinity;
            this.canResetStats = false;
        }

        const ping = Date.now() - data.timestamp;
        if (Diagnostics.worstRemotePing < ping) {
            Diagnostics.worstRemotePing = ping;
            Diagnostics.worstRemoteConnection = connection.peer;
            Diagnostics.worstRemoteLatency =
                this.timeConnectedTo[connection.peer] - data.frame;
        }

        this.newMessageQueue.add({ ...data, id: connection.peer });
    }

    private setupConnection(connection: DataConnection, startCounter: boolean) {
        this.connections.set(connection.peer, connection);
        this.remoteIds.push(connection.peer);

        if (startCounter) this.timeConnectedTo[connection.peer] = 0;

        for (const newConnectionListener of this.newConnectionListeners) {
            newConnectionListener(connection);
        }

        this.onData(connection, (data) => {
            // Add fake lag for testing
            if (Diagnostics.artificialLag) {
                setTimeout(() => {
                    this.onDataListener(connection, data);
                }, 50);
                return;
            }

            this.onDataListener(connection, data);
        });
    }

    async connect(peerId: string, options?: PeerConnectOption) {
        peerId = `BAGEL-TEST-${peerId}`;
        return new Promise<DataConnection>((res, rej) => {
            const connection = this.peer.connect(peerId, options);

            connection.once("open", () => {
                console.log("Connecting to", peerId, "(Initiated locally)...");
                this.setupConnection(connection, true);
                res(connection);
                // const acknowledge = (data: any) => {
                //     console.log(data);
                //     if (data.event === "ConnectionAcknowledged") {
                //         let timeDiff = Date.now() - data.timestamp;
                //         timeDiff *= 5;
                //         timeDiff = Math.min(timeDiff, 1000);
                //         const startTime = Date.now() + timeDiff;
                //         console.log(`Starting in ${timeDiff}ms ${startTime}`);

                //         connection.removeListener("data", acknowledge);
                //         connection.send({
                //             event: "StartTime",
                //             startTime,
                //         });
                //         console.log("Sent start event");

                //         setTimeout(() => {
                //             this.setupConnection(connection, true);
                //             res(connection);
                //         }, timeDiff);
                //     }
                // };
                // connection.on("data", acknowledge);
            });

            connection.once("error", (err) => rej(err));
        });
    }

    send(event: string, data: any, ...peerIds: string[]) {
        if (peerIds.length === 0) peerIds = this.remoteIds;
        for (const peerId of peerIds) {
            this.connections.get(peerId)!.send({
                event,
                data,
                frame: this.timeConnectedTo[peerId],
                timestamp: Date.now(),
            });
        }
    }

    update() {
        for (const id of this.remoteIds) {
            this.timeConnectedTo[id]++;
        }

        this.newMessagesByType.forEach((set) => set.clear());

        this.newMessageQueue.forEach((message) => {
            if (!this.newMessagesByType.has(message.event)) {
                this.newMessagesByType.set(message.event, new Set([message]));
            } else {
                this.newMessagesByType.get(message.event)!.add(message);
            }
        });

        this.newMessageQueue.clear();
        this.canResetStats = true;
    }
}

export const networkConnectionPlugin = ResourceUpdaterPlugin(
    NetworkConnection,
    true
);
