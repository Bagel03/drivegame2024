import { World } from "bagelecs";

export class ServerConnection {
    private readonly url = "http:localhost:8080/api/v1"; //"https://8v7x2lnc-8080.use.devtunnels.ms/api/v1";

    fetch(
        path: string,
        options?: {
            options?: RequestInit;
            searchParams?: Record<string, string>;
        }
    ) {
        const url = new URL(this.url + path);
        if (options?.searchParams) {
            for (const [key, value] of Object.entries(options.searchParams)) {
                url.searchParams.set(key, value);
            }
        }
        return fetch(url, options?.options).then((res) => res.json());
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
