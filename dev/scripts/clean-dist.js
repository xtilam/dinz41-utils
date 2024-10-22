const { existsSync, rmSync, mkdir, mkdirSync } = require("fs");
const { dirDefines } = require("../common/dir-define");

if (existsSync(dirDefines.distDir)) {
  rmSync(dirDefines.distDir, { recursive: true });
}

mkdirSync(dirDefines.distDir);
