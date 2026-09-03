// Thin re-export so `extends: ["cz-cubics/commitlint"]` resolves to a real
// file. commitlint's extends resolution does its own file lookup and does
// not consult package.json's "exports" map
module.exports = require("./commitlint.config.js");
