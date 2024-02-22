import { World } from "bagelecs";

export class ServerConnection {
    private readonly baseUrl = "https://drivegame2024.onrender.com";
    // localStorage.getItem("dev-env") === "true"
    //     ? "http://localhost:8080"
    //     : "https://drivegame2024.onrender.com"; //"https://8v7x2lnc-8080.use.devtunnels.ms/api/v1";
    private readonly url = "https://drivegame2024.onrender.com/api/v1";
    // localStorage.getItem("dev-env") === "true"
    //     ? "http://localhost:8080/api/v1"
    //     : "https://drivegame2024.onrender.com/api/v1"; //"https://8v7x2lnc-8080.use.devtunnels.ms/api/v1";

    fetch(
        path: string,
        options?: {
            options?: RequestInit;
            searchParams?: Record<string, string>;
            useBaseUrl?: boolean;
            leaveRaw?: boolean;
        }
    ) {
        const url = new URL((options?.useBaseUrl ? this.baseUrl : this.url) + path);
        if (options?.searchParams) {
            for (const [key, value] of Object.entries(options.searchParams)) {
                url.searchParams.set(key, value);
            }
        }
        return fetch(url, options?.options).then((res) =>
            options?.leaveRaw ? res : res.json()
        );
    }

    post(url: string, body: any) {
        return fetch(this.url + url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });
    }
}

export function ServerConnectionPlugin(world: World) {
    world.add(new ServerConnection());
}
