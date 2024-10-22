// ----------------------------------------------
const fs = require("fs/promises");
const path = require("path");
const extension = {
  file: {
    writeJSON: writeJSONFile,
    readJSON: readJSONFile,
  },
};
const __utilsExtension__files = () => extension;
module.exports = { __utilsExtension__files };
// ----------------------------------------------
function readJSONFile(filePath = "") {
  return fs.readFile(filePath, "utf-8").then(JSON.parse);
}
async function writeJSONFile(filePath = "", data = {}, initDist = false) {
  if (initDist) await initDist();
  return fs.writeFile(filePath, JSON.stringify(data, null, "\t"), "utf-8");
  // ----------------------------------------------
  async function initDist() {
    const baseDir = path.dirname(filePath);
    const [stat] = await fs.stat(baseDir).safe();
    if (!stat) await fs.mkdir(baseDir);
  }
}
