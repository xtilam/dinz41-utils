const path = require("path");
const { dirDefines } = require("./dir-define");

const electronJSDist = path.join(dirDefines.distDir, "index.js");
const libJSDist = path.join(dirDefines.distDir, "libs.js");
const scriptDefine = { distElectronJSPath: electronJSDist, distLibsJSPath: libJSDist };

module.exports = { scriptDefine };
