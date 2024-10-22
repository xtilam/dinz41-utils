require("../utils/promise-utils");
require("colors");

const fs = require("fs/promises");
const { dirDefines } = require("../common/dir-define");
const { scriptDefine } = require("../common/script-define");
const { existsSync, rmSync, mkdirSync } = require("fs");
const { utils } = require("../utils/utils");
const path = require("path");

const dd = dirDefines;
const ds = scriptDefine;

const { log } = utils.LogTime("build");
const { npm, npx, run } = utils.exec;
async function main() {
  log("clean dist");
  cleanDist();
  log("build tsc");
  await npx("tsc -b");
  await fs.cp(
    path.join(dirDefines.typesDir, "safe-promise.d.ts"),
    path.join(dirDefines.distDir, "/plugins/safe-promise.d.ts")
  );
  
  log("minify code");
  // await npx('esbuild "dist/**/*.js" --outdir=dist --minify --allow-overwrite');
  log("write package json");
  const packageJSON = await utils.file.readJSON(
    path.join(dirDefines.projectDir, "package.json")
  );
  delete packageJSON.files;
  delete packageJSON.scripts;
  delete packageJSON.devDependencies;
  packageJSON.main = "";
  await utils.file.writeJSON(
    path.join(dirDefines.distDir, "package.json"),
    packageJSON
  );
}

async function rewritePackageJSON() {
  const appPKPath = path.join(dd.projectDir, "package.json");
  const distPKPath = path.join(dd.distDir, "package.json");
  const appPK = JSON.parse(await fs.readFile(appPKPath, "utf-8"));
  const distPK = JSON.parse(await fs.readFile(distPKPath, "utf-8"));
  console.log(distPK.dependencies, appPKPath.dependencies);
  distPK.name = appPK.name;
  distPK.devDependencies = {};
  distPK.devDependencies.electron = appPK.devDependencies.electron;
  distPK.main = "dist/index.js";
  await fs.writeFile(distPKPath, JSON.stringify(distPK, null, "\t"), "utf-8");
}

function cleanDist() {
  if (existsSync(dirDefines.distDir)) {
    rmSync(dirDefines.distDir, { recursive: true });
  }
  mkdirSync(dirDefines.distDir);
}

main();
