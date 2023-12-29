import "./engine/polyfills";
import { NetworkConnection } from "engine/multiplayer/network";

declare global {
    interface Window {
        nc: NetworkConnection;
    }
}
const nc = (window.nc = new NetworkConnection(null as any));
Promise.resolve().then(() => {
    nc.on<[number, number]>("ping", ([frame, time]) => {
        document.body.innerHTML = `Lag: ${nc.framesConnected - frame}frames, ${
            Date.now() - (nc.connectionStartTime + time)
        }ms`;
    });

    nc.waitForConnection.then(() => {
        setInterval(() => {
            nc.update();
            nc.send("ping", [
                nc.framesConnected,
                Date.now() - nc.connectionStartTime,
            ]);
        }, 1000 / 60);
    });
});
