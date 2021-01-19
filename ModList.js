// 1.18.20
// Simple Node.js script to grab list of all WARFRAME mods from overframe.gg

const fetch = require("node-fetch");    // fetch API
const { JSDOM } = require("jsdom");     // DOM and HTML parser
const fs = require("fs");               // I/O operations

const NUM_PAGES = 11;
const URL = "https://overframe.gg/items/mod?page=";
const OUTPUT_FILE = "ModNames.txt";

var modList = [];
var promises = [];

for (var i = 0; i < NUM_PAGES; i++) {
    promises.push(
        fetch(URL + i + "-0")
        .then(function(response) {
            return response.text();
        })
        .then(function(html) {
            var dom = new JSDOM(html);
            // console.log(dom);
            var $ = require("jquery")(dom.window);
            // inner text of elements with this particular class contain mod names
            $(".ItemBrowser_itemName__1TlTL").each(function() {
                // would this create conflict between multiple async operations?
                // or since JS is single-threaded, would each async operation take turns operating
                // on the same array?
                modList.push($(this).text());
            });
        })
        .catch(function(err) {
            console.log("Failed to fetch page: ", err);
        })
    );
}

// waiting for all promises to resolve before continuing to process data
module.exports = Promise.all(promises)
.then(function() {
    modList.sort();

    fs.writeFileSync(OUTPUT_FILE, modList.toString());
    console.log(OUTPUT_FILE, "written successfully!")
});
