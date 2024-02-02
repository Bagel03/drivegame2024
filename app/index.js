// To enable hot reloading, we don't actually include the "game logic" in the app
// Instead, the app (ie. the thing that ios runs) is just a fancy web browser that
// only load 1 website: the game. That way, we can publish to that url and have all
// apps auto reload all the new content on demand.

const PROD_URL = "https://bagel03.github.io/drivegame2024/builds/prod";
const LOCAL_URL = "./dist";
const DIST_URL = localStorage.getItem("dev-env") ? LOCAL_URL : PROD_URL;

window.DIST_URL = DIST_URL;

const BUNDLE_URL = DIST_URL + "/index.js";
const CSS_URL = DIST_URL + "/index.css";

// Show loading screen
document.body.innerHTML = `
    <div id="preloadScreen" style="z-index: 999; width: 100vw; height: 100vh; display: flex; align-items: center; justify-content: center; flex-direction: column; background-image: radial-gradient(#44403C, #171717)">
        <img src="app/logo.png" />
            <h1 style="font-size: 24px; color: white" id="downloadText">Downloading Content...</h1>
    </div>
`;

const downloadText = document.querySelector("#downloadText");
const intervalId = setInterval(() => {
    const numPeriods = downloadText.textContent.match(/\./g)?.length || 0;
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
