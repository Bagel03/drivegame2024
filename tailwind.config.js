const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{html,js,ts,tsx}", "./index.html"],
    theme: {
        extend: {
            fontFamily: {
                default: ["'Rajdhani'", ...defaultTheme.fontFamily.sans],
                paragraph: ["'Fira Mono", ...defaultTheme.fontFamily.mono],
            },
            textColor: {
                white: "#EFFAFA",
            },
            colors: {
                base: "#0B0E0E",
                secondary: "#141919",
                primary: "#7651D6",
                accent: "#622AE4",
                menuBackground: "#1e1b4b",
                menuBackgroundAccent: "#5b21b6",
            },
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
            },
        },
    },
    plugins: [],
};
