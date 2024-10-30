require("../utils/promise-utils");
require("colors");

const fs = require("fs/promises");
const { dirDefines } = require("../common/dir-define");
const { scriptDefine } = require("../common/script-define");
const { existsSync, rmSync, mkdirSync } = require("fs");
const { utils } = require("../utils/utils");
const path = require("path");
const esbuild = require("esbuild");

const dd = dirDefines;
const ds = scriptDefine;

const { log } = utils.LogTime("build");
const { npm, npx, run } = utils.exec;
async function main() {
  log("clean dist");
  await cleanDist();
  log("build tsc");
  await npx("tsc -b");
  // await fs.cp(
  //   path.join(dirDefines.typesDir, "safe-promise.d.ts"),
  //   path.join(dirDefines.distDir, "/plugins/safe-promise.d.mts")
  // );

  log("minify code");
  await esbuild.build({
    entryPoints: ["src/**/*.mts"],
    outdir: "dist",
    allowOverwrite: true,
    sourcemap: false,
    outExtension: { ".js": ".mjs" },
    minifySyntax: true,
    minify: true,
    minifyWhitespace: false,
    keepNames: false,
  });
  log("write package json");

  const packageJSON = await utils.file.readJSON(
    path.join(dirDefines.projectDir, "package.json")
  );

  packageJSON.type = "module";
  delete packageJSON.files;
  delete packageJSON.scripts;
  delete packageJSON.devDependencies;
  packageJSON.main = "";
  // await renameMJS();
  await utils.file.writeJSON(
    path.join(dirDefines.distDir, "package.json"),
    packageJSON
  );
  log("done");
}
async function renameMJS(basePath = dirDefines.distDir) {
  const dts = ".d.ts";
  async function recursive(dir) {
    const files = await fs.readdir(dir);
    await Promise.all(
      files.map(async (file) => {
        const filePath = path.join(dir, file);
        const stat = await fs.stat(filePath);
        if (stat.isDirectory()) return await recursive(filePath);
        if (!file.endsWith(dts)) return;
        const newName = path.basename(file, dts) + ".mjs.d.ts";
        await fs.rename(filePath, path.join(dir, newName));
      })
    );
  }
  await recursive(basePath);
}
async function getExports(basePath = dirDefines.distDir) {
  const exports = {};
  const setExt = new Set([".mjs", ".js"]);
  await recursive();
  return exports;
  // ----------------------------------------------
  async function recursive(subPath = ".") {
    const filePath = path.join(basePath, subPath);
    const stat = await fs.stat(filePath);
    if (stat.isDirectory()) {
      const files = await fs.readdir(filePath);
      await Promise.all(files.map((file) => recursive(`${subPath}/${file}`)));
    }
    const ext = path.extname(filePath);
    if (!setExt.has(ext)) return;
    exports[
      `${path.dirname(subPath)}/${path.basename(subPath).slice(0, -ext.length)}`
    ] = {
      import: `${subPath}`,
    };
  }
}

async function cleanDist() {
  if (existsSync(dirDefines.distDir)) {
    await fs.rm(dirDefines.distDir, { recursive: true }).safe();
  }
  await fs.mkdir(dirDefines.distDir).safe();
}

main();
