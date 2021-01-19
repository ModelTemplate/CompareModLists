// 1.18.20
// Simple Node.js script to grab list of all WARFRAME mods from the wiki using their API

const fetch = require("node-fetch");    // fetch API
const { JSDOM } = require("jsdom");     // DOM and HTML parser
const luainjs = require("lua-in-js");   // parsing Lua code to JS
const luaEnv = luainjs.createEnv();
const { union, intersection, difference } = require("set-ops");     // set operations
const fs = require("fs");               // I/O operations

// using wiki API to grab page content
const URL = "https://warframe.fandom.com/api.php?action=parse&page=Module:Mods/data&format=json";
const OUTPUT_FILE = "WikiModNames.txt";

module.exports = fetch(URL)
.then(function(response) {
    return response.json();
})
.then(function(json) {
    var table = json["parse"]["text"]["*"];  // Lua table format
    var dom = new JSDOM(table);
    var $ = require("jquery")(dom.window);
    table = $(".mw-code.mw-script");     // grabbing only Lua code that returns a Lua table
    
    table = luaEnv.parse(table.text()).exec();    // convert to JS dictionary
    // parsing Lua-formatted array
    var ignoreCountList = table["strValues"]["IgnoreInCount"]["numValues"];
    // parsing Lua-formatted table
    var modsList = Object.keys(table["strValues"]["Mods"]["strValues"]);

    // removing ignored mods
    var modSet = difference(new Set(modsList), new Set(ignoreCountList));

    return Array.from(modSet);
})
.then(function(modList) {
    modList.sort();

    fs.writeFileSync(OUTPUT_FILE, modList.toString());
    console.log(OUTPUT_FILE, "written successfully!")
})
.catch(function(err) {
    console.log("Failed to fetch page: ", err);
});
