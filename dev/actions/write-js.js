// const { existsSync, mkdirSync, rmdir, rmdirSync, rmSync } = require("fs");
// const { writeFile } = require("fs/promises");
// const path = require("path");

// const writeJS = async () => {
//   const distPath = path.join(__dirname, "../dist");
//   if (existsSync(distPath)) {
//     rmSync(distPath, { recursive: true });
//   }
//   mkdirSync(distPath, { recursive: true });
//   const libsJSPath = path.join(distPath, "libs.js");
//   const electronJSPath = path.join(distPath, "electron.js");
//   await Promise.all([
//     writeFile(libsJSPath, "console.log('wait lib.js compile')"),
//     writeFile(electronJSPath, "console.log('wait electron.js compile')"),
//   ]);
// };

// module.exports = { writeJS };
