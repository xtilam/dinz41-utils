const sevenBin = require("7zip-bin");
const { existsSync } = require("fs");
const fs = require("fs/promises");
const __taskUtils = require("./task-utils");
const { spawn } = require("child_process");
// ----------------------------------------------
const utils = { sevenZip: { folder: sevenZipFolder } };
const __7zUtils = () => utils;
module.exports = __7zUtils;
// ----------------------------------------------

async function sevenZipFolder(sourceDir, destinationFile) {
  if (existsSync(destinationFile)) await fs.rm(destinationFile);
  await __taskUtils().waitTask(
    spawn(sevenBin.path7za, ["a", destinationFile, sourceDir])
  );
}
