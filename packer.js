const spritesheet = require("spritesheet-js");
spritesheet(
    "C:/Dev Temp/ts/project-b/src/assets/sprites/**/*.png",
    { format: "json" },
    function (err) {
        if (err) throw err;
        console.log("spritesheet successfully generated");
    }
);
