// 1.18.20
// Comparing two mod lists from the WARFRAME wiki and overframe.gg

const fs = require("fs");
const { union, intersection, difference } = require("set-ops");

const FILE_NAMES = [ "ModNames.txt", "WikiModNames.txt" ];

// waiting on other scripts to finish processing and saving data before actual comparison
Promise.all([ require("./ModList.js"), require("./WikiModList.js") ])
.then(function() {
    var modNames = readFile(FILE_NAMES[0]);
    console.log(FILE_NAMES[0], "read successfully!");
    var wikiModNames = readFile(FILE_NAMES[1]);
    console.log(FILE_NAMES[1], "read successfully!");

    var wikiModsMissing = difference(new Set(modNames), new Set(wikiModNames));
    var overframeModsMissing = difference(new Set(wikiModNames), new Set(modNames));

    console.log("Wiki is missing the following mods:\n", wikiModsMissing);
    console.log("overframe.gg is missing the following mods:\n", overframeModsMissing);
})
.catch(function(err) {
    console.log(err);
});

// reads specified file and returns an array that splits the string by comma separators
function readFile(fileName) {
    return fs.readFileSync(fileName, "utf8").split(",");
}
