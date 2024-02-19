const spritesheet = require("spritesheet-js");
const Jimp = require("jimp");
const { readdirSync, copyFileSync, existsSync, mkdirSync } = require("fs");
const { exec } = require("child_process");
//spritesheet-js -f pixi.js -n atlas -p dist/assets --trim ./src/assets/sprites/*.png

const spriteDir = __dirname + "/src/assets/sprites";
const tempDir = __dirname + "/build_temp";
// Generate the temp files:
const files = readdirSync("./src/assets/sprites");
if (!existsSync(tempDir)) {
    mkdirSync(tempDir);
}

const promises = files.map((file) => {
    copyFileSync(
        spriteDir + "/" + file, // __dirname + `/src/assets/sprites/${file}`,
        tempDir + "/" + file.replace("_", "right_") //__dirname + `/temp/${file.replace("_", "right_")}`
    );
    return Jimp.read(spriteDir + "/" + file)
        .then((img) => img.flip(true, false))
        .then((img) => img.write(tempDir + "/" + file.replace("_", "left_")));
});

Promise.all(promises)
.then(() => console.log("All images prepared"));
