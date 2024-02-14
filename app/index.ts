import { Capacitor } from "@capacitor/core";
import { GoogleAuth } from "@codetrix-studio/capacitor-google-auth";

// To enable hot reloading, we don't actually include the "game logic" in the app
// Instead, the app (ie. the thing that ios runs) is just a fancy web browser that
// only load 1 website: the game. That way, we can publish to that url and have all
// apps auto reload all the new content on demand.

const PROD_URL = "https://bagel03.github.io/drivegame2024/builds/prod";
const LOCAL_URL = "http://localhost:5500/dist";
const DIST_URL = localStorage.getItem("dev-env") ? LOCAL_URL : PROD_URL;

declare global {
    interface Window {
        DIST_URL: string;
    }
}


window.DIST_URL = DIST_URL;


GoogleAuth.initialize({
    clientId: "41009933978-vrdr3g1i3mhjh6u7vip1sce01o8rnijf.apps.googleusercontent.com",
    grantOfflineAccess: true,
    scopes: ["profile", "email"]
})
// window.google ??= {
//     accounts: {
//         id: {
//             renderButton() {},
//             initialize() {},
//         },
//     },
// };

const BUNDLE_URL = DIST_URL + "/index.js";
const CSS_URL = DIST_URL + "/index.css";

// Show loading screen
document.body.innerHTML = `
    <div id="preloadScreen" style="z-index: 999; width: 100vw; height: 100vh; display: flex; align-items: center; justify-content: center; flex-direction: column; background-image: radial-gradient(#44403C, #171717)">
        <img src="./logo.png" />
            <h1 style="font-size: 24px; color: white" id="downloadText">Downloading Content...</h1>
    </div>
`;

// Load google auth stuff
if (Capacitor.isNativePlatform() || true) {
    // Load ios / android stuff
    window.google = {
        accounts: {
            //@ts-expect-error
            id: {
                renderButton(parent: HTMLElement) {
                    const container = document.createElement("div");

                    const className = {
                        container:
                            "text-white text-xl bg-[#1a73e8] hover:bg-[#5194EE] cursor-pointer h-10 w-72 rounded-[4px] transition-colors duration-100 flex ",
                        span: "text-white text-center grow flex justify-center items-center",
                        icon: "fa-brands fa-google text-white self-end mr-2 flex justify-center items-center h-full",
                    };

                    container.className = className.container;

                    const span = document.createElement("span");
                    span.textContent = "Sign in with Google";
                    span.className = className.span;
                    container.append(span);

                    const icon = document.createElement("i");
                    icon.className = className.icon;
                    container.appendChild(icon);

                    container.onclick = async () => {
                        const user = await GoogleAuth.signIn();
                        const jwt = user.authentication.idToken;
                        console.log(jwt);
                        //@ts-expect-error
                        window.google.accounts.id.callback?.({credential: jwt});
                    };
                    parent.appendChild(container);
                },
                initialize({ client_id, callback }) {
                    GoogleAuth.initialize({
                        clientId: client_id,
                        scopes: ["profile", "email"],
                        grantOfflineAccess: true,
                    });

                    //@ts-expect-error
                    window.google.accounts.id.callback = callback;
                },
            },
        },
    };
} else {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    document.head.append(script);
}

const downloadText = document.querySelector("#downloadText")!;
const intervalId = setInterval(() => {
    const numPeriods = (downloadText.textContent.match(/\./g) || {}).length || 0;
    downloadText.textContent =
        downloadText.textContent.replace(/\./g, "") +
        ".".repeat((numPeriods % 3) + 1);
}, 1000 / 3);

// Load CSS
const link = document.createElement("link");
link.rel = "stylesheet";
link.href = CSS_URL;
document.head.appendChild(link);

// Load JS once css is loaded
link.onload = () => {
    const script = document.createElement("script");
    script.src = BUNDLE_URL;
    document.body.appendChild(script);
    script.onload = () => clearInterval(intervalId);
};

// script.onload = () => {
//     document.body.removeChild(document.body.firstChild);
// };
