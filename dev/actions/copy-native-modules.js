// const axios = require("axios");

const path = require("path");
const fs = require("fs/promises");

const { dirDefines } = require("../common/dir-define");
const { nodeModulesDir, distDir } = dirDefines;
/**@type {<T>(v: Promise<T>)=>Promise<PromiseSettledResult<T>>}*/
const settled = (v) => Promise.allSettled([v]);

async function copySqlite3() {
  const sqlite3 = require("sqlite3");
  const modulePath = path.join(nodeModulesDir, "sqlite3");
  const sqliteNodePath = path.resolve(sqlite3.path);
  const targetCopyPath = path.join(
    distDir,
    sqliteNodePath.slice(modulePath.length)
  );
  const targetDir = path.dirname(targetCopyPath);
  const stats = await settled(fs.stat(targetDir));
  if (stats.status === "fulfilled") {
    await fs.rm(targetDir, { recursive: true });
  }
  await fs.mkdir(targetDir, { recursive: true });
  await fs.cp(sqliteNodePath, targetCopyPath);
}

async function copyNativeModules() {
  await Promise.allSettled([copySqlite3()]);
}

module.exports = { copyNativeModules };
