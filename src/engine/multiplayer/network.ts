import { Component, Logger, Type, World } from "bagelecs";
import { Peer, DataConnection } from "peerjs";
import { Diagnostics } from "engine/diagnostics";
import { ResourceUpdaterPlugin } from "engine/resource";

enum NetworkEvent {
    ACCEPT_CONNECTION,
    DECLINE_CONNECTION,
    DATA,
    FETCH,
    FETCH_RESPONSE,
}

type RawNetworkPacket<T = never> = {
    event: NetworkEvent;
    data: T;
    subEvent?: string;
    id?: number;
};

declare global {
    // Override this to add stuff
    interface NetworkFetchPoints {}
}

export const PeerId = Component(Type.string);

export class NetworkConnection {
    private readonly logger = new Logger("Network");

    private static readonly idPrefix = "drivegame-beta-"; // "drivegame-prod-"
    private static readonly idLength = 1;
    private static generateId(): string {
        return new Array(NetworkConnection.idLength)
            .fill(0) // Make array w/ length of 5
            .map((_) => Math.floor(Math.random() * 2)) // Fill the array with random numbers 0 - 25
            .map((num) => String.fromCharCode("A".charCodeAt(0) + num)) // Map numbers to capital letters
            .join(""); // Turn it into a string
    }

    private readonly peer!: Peer;
    public readonly id!: string;

    public readonly waitForServerConnection: Promise<void>;
    constructor(public readonly world: World) {
        this.waitForServerConnection = this.connectToBrokageServer();
        this.waitForServerConnection.then(() => {
            this.logger.log("Connected to brokage server, id is", this.id);
            this.handleIncomingConnections();

            window.addEventListener("beforeunload", () => {
                this.close();
            });
        });
        // this.id = NetworkConnection.generateId();
        // this.peer = new Peer(this.id);
        this.onConnect = this.onConnect.bind(this);
        this.onClose = this.onClose.bind(this);
    }

    //#region Server Connection
    private tryFindId() {
        const id = NetworkConnection.generateId();
        const peer = new Peer(NetworkConnection.idPrefix + id);
        this.logger.log("Trying to connect with id", id);
        return new Promise<{ id: string; peer: Peer }>((res, rej) => {
            peer.on("open", () => {
                res({ id, peer });
            });
            peer.on("error", async (error) => {
                if (error.type === "unavailable-id") {
                    peer.disconnect();
                    this.logger.log("Failed to connect with id", id);
                    res(await this.tryFindId());
                    return;
                    // testssffasd
                }
                this.logger.error(error);
                // This shouldn't happen (really shouldn't get any other errors than in-use id)
                rej(error);
            });
        });
    }

    async connectToBrokageServer() {
        const { id, peer } = await this.tryFindId();
        //@ts-expect-error
        this.id = id;
        //@ts-expect-error
        this.peer = peer;
    }
    //#endregion

    //#region Connections
    public readonly isConnected: boolean = false;
    private readonly dummyConnection = new DummyDataConnection();
    private remoteConnection: DataConnection = this.dummyConnection as any;

    public readonly remoteId!: string;

    private resolvePromisesWaitingForConnection!: (remoteId: string) => void;
    public waitForConnection: Promise<string> = new Promise((res) => {
        this.resolvePromisesWaitingForConnection = res;
    });

    public readonly connectionStartTime: number = null as any;
    public framesConnected: number = null as any;

    private onConnect(openTime: number) {
        //@ts-expect-error
        this.isConnected = true;
        //@ts-expect-error
        this.connectionStartTime = openTime;
        //@ts-expect-error
        this.remoteId = this.remoteConnection.peer.replace(
            NetworkConnection.idPrefix,
            ""
        );

        this.framesConnected = 0;

        this.remoteConnection.on("close", this.onClose);

        this.logger.log("Connection opened to", this.remoteId);
        this.resolvePromisesWaitingForConnection(this.remoteId);
    }

    private onClose() {
        //@ts-expect-error
        this.remoteConnection = this.dummyConnection.fromDataConnection(
            this.remoteConnection
        );

        //@ts-expect-error
        this.isConnected = false;

        this.framesConnected = null as any;

        this.waitForConnection = new Promise((res) => {
            this.resolvePromisesWaitingForConnection = res;
        });
        this.logger.log("Closed connection to", this.remoteId);
    }

    close() {
        this.remoteConnection.close();
    }

    // Established locally
    async connect(id: string, timeout = 5000) {
        if (this.isConnected) {
            this.logger.log(
                "Can not connect to",
                id,
                "(Already connected to",
                this.remoteId,
                ")"
            );
            return Promise.reject();
        }
        const remoteConnection = this.peer.connect(NetworkConnection.idPrefix + id, {
            metadata: {
                id: this.id,
            },
        });
        this.logger.log(
            "Establishing connection with",
            id,
            "... (Initiated locally)"
        );

        return new Promise<void>((res, rej) => {
            setTimeout(() => {
                if (this.isConnected) return;
                remoteConnection.close();
                rej("timeout");
            }, timeout);
            remoteConnection.on("open", () => {
                // Save the open time in case this connection was accepted
                const tempStartTime = Date.now();

                // We have to wait for a response (either accept or reject)
                remoteConnection.once("data", (({
                    event,
                    data,
                }: RawNetworkPacket<{ id: string }>) => {
                    if (event === NetworkEvent.ACCEPT_CONNECTION) {
                        this.logger.log("Connection with", data.id, "was accepted");
                        this.remoteConnection =
                            this.dummyConnection.morphToRealConnection(
                                remoteConnection
                            );
                        this.onConnect(tempStartTime);
                        res();
                    } else if (event === NetworkEvent.DECLINE_CONNECTION) {
                        this.logger.log(
                            "Connection with",
                            data.id,
                            "was declined, closing connection"
                        );
                        remoteConnection.close();
                        rej();
                    }
                }) as any);
            });
        });
    }

    // Established remotely
    private handleIncomingConnections() {
        this.peer.on("connection", async (connection) => {
            this.logger.log(
                "Establishing connection with",
                connection.metadata.id,
                "... (Initiated remotely)"
            );

            if (!connection.open) await this.waitForConnectionCB(connection, "open");
            const tempStartTime = Date.now();

            if (this.isConnected) {
                this.logger.log(
                    "Declining connection with",
                    connection.metadata.id,
                    "(Already connected)"
                );
                // Send a bad message then close
                connection.send({
                    event: NetworkEvent.DECLINE_CONNECTION,
                    data: {
                        id: this.id,
                    },
                } satisfies RawNetworkPacket<{ id: string }>);
                connection.on("close", () => {
                    this.logger.log(
                        "Closed connection with",
                        connection.metadata.id
                    );
                });
                return;
            }

            this.logger.log(
                "Accepting connection with",
                connection.metadata.id,
                "..."
            );
            // Send an accept
            connection.send({
                event: NetworkEvent.ACCEPT_CONNECTION,
                data: {
                    id: this.id,
                },
            } satisfies RawNetworkPacket<{ id: string }>);
            this.remoteConnection =
                this.dummyConnection.morphToRealConnection(connection);
            this.onConnect(tempStartTime);
        });
    }
    //#endregion

    //#region Simple Data Transfer
    on<T>(eventName: string | "ALL", cb: (data: T) => any) {
        const wrapper = (packet: RawNetworkPacket<T>) => {
            // if (packet.event !== NetworkEvent.DATA) return;
            if (eventName !== "ALL" && packet.subEvent !== eventName) return;

            return cb(packet.data);
        };
        // this.dataListeners.push(wrapper);
        this.remoteConnection.on("data", wrapper as any);
    }

    async send(eventName: string, data: any) {
        if (Diagnostics.artificialLag) await Promise.timeout(60);

        this.remoteConnection.send({
            event: NetworkEvent.DATA,
            subEvent: eventName,
            data,
        } satisfies RawNetworkPacket<any>);
    }
    //#endregion

    //#region Fetch / Response
    private nextFetchId = 0;
    fetch<T extends keyof NetworkFetchPoints>(
        endpoint: T
    ): Promise<NetworkFetchPoints[T]> {
        const transactionId = this.nextFetchId++;
        this.remoteConnection.send({
            event: NetworkEvent.FETCH,
            subEvent: endpoint,
            id: transactionId,
        });

        return new Promise((res) => {
            const tempFn = (packet: RawNetworkPacket<any>) => {
                if (packet.event !== NetworkEvent.FETCH_RESPONSE) return;
                if (packet.id !== transactionId) return;
                this.remoteConnection.off("data", tempFn as any);
                res(packet.data);
            };

            this.remoteConnection.on("data", tempFn as any);
        });
    }

    addResponse<T extends keyof NetworkFetchPoints>(
        endpoint: T,
        respond: () => NetworkFetchPoints[T] | Promise<NetworkFetchPoints[T]>
    ) {
        this.remoteConnection.on("data", (async (packet: RawNetworkPacket) => {
            if (packet.event !== NetworkEvent.FETCH || packet.subEvent !== endpoint)
                return;

            const data = await respond();

            this.remoteConnection.send({
                event: NetworkEvent.FETCH_RESPONSE,
                id: packet.id!,
                data,
            } satisfies RawNetworkPacket<any>);
        }) as any);
    }

    //#region Utils
    private waitForConnectionCB<
        T extends "open" | "data" | "error" | "close" | "iceStateChanged"
    >(connection: DataConnection, ev: T) {
        return new Promise<void>((res) => {
            connection.once(ev, (...args) => res());
        });
    }

    update() {
        if (this.framesConnected !== null) {
            this.framesConnected++;
        }
    }
}

// The "DummyDataConnection" class has the same *general* shape as a data connection, but with no actual remote peer
// Instead, it is used when we dont have a connection to store listeners for when someone does connect
class DummyDataConnection {
    private readonly cbs: any[] = [];

    on(ev: string, cb: any) {
        if (ev !== "data")
            console.warn(
                "Dummy listener captured unexpected event",
                ev,
                '(Only "data" event is expected with a dummy)'
            );
        this.cbs.push(cb);
    }

    send(...args: any) {
        console.warn(
            "Send was called with a dummy data connection. Data can not be sent without an actual data connection and remote peer. Make sure client is connected before sending data"
        );
    }

    close() {}

    // Used for when a client connects
    morphToRealConnection(connection: DataConnection) {
        this.cbs.forEach((cb) => connection.on("data", cb));
        return connection;
    }

    // Used for when a client disconnects
    fromDataConnection(connection: DataConnection) {
        this.cbs.length = 0;
        this.cbs.push(...connection.listeners("data"));
        return this;
    }
}

export const networkConnectionPlugin = ResourceUpdaterPlugin(
    NetworkConnection,
    true
);
