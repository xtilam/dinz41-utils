require("../utils/promise-utils");
require("colors");

const fs = require("fs/promises");
const { dirDefines } = require("../common/dir-define");
const { scriptDefine } = require("../common/script-define");
const { existsSync, rmSync, mkdirSync, write } = require("fs");
const { utils } = require("../utils/utils");
const path = require("path");
const esbuild = require("esbuild");
const { type } = require("os");

const outExt = ".mjs";
const { log } = utils.LogTime("build");
const { npx } = utils.exec;
const buildOK = (name) => () => log(`BUILD_OK::${name}`);

async function main() {
  log("clean dist");
  await cleanDist();
  await Promise.all([
    npx("tsc -b").then(buildOK("tsc")),
    esbuild
      .build({
        entryPoints: ["src/**/*.mts"],
        outdir: "dist",
        outExtension: {
          ".js": outExt,
        },
        allowOverwrite: true,
        sourcemap: false,
        minifySyntax: true,
        minify: true,
        minifyWhitespace: false,
        keepNames: false,
      })
      .then(buildOK("esbuild")),
    writePackageJSON().then(buildOK("package.json")),
  ]);

  log("done");
}

async function writePackageJSON(exportsObj) {
  const packageJSON = await utils.file.readJSON(
    path.join(dirDefines.projectDir, "package.json")
  );
  packageJSON.type = "module";
  delete packageJSON.files;
  delete packageJSON.scripts;
  delete packageJSON.devDependencies;
  packageJSON.main = "";
  // packageJSON.exports = exportsObj;
  await utils.file.writeJSON(
    path.join(dirDefines.distDir, "package.json"),
    packageJSON
  );
}
async function getExports(basePath = dirDefines.distDir) {
  const exports = {};
  basePath = path.resolve(basePath);
  const files = await fs.readdir(basePath);
  await Promise.all(files.map((file) => recursive(path.join(basePath, file))));
  return exports;
  // ----------------------------------------------
  async function recursive(filePath = "") {
    const stat = await fs.stat(filePath);
    if (stat.isFile()) {
      const ext = path.extname(filePath);
      if (ext !== outExt) return;
      const subName = filePath
        .slice(basePath.length + 1, -ext.length)
        .replace(path.sep, "/");
      exports[`./${subName}`] = {
        import: `./${subName}${outExt}`,
        types: `./${subName}.d.mts`,
      };
    }
    if (!stat.isDirectory()) return;
    // const packageJSON = initPackageJSON(dir);
    const files = await fs.readdir(filePath);
    await Promise.all(
      files.map((file) => recursive(path.join(filePath, file)))
    );
  }
}

async function cleanDist() {
  if (existsSync(dirDefines.distDir)) {
    const files = await fs.readdir(dirDefines.distDir);
    return await Promise.all(
      files.map((file) =>
        fs.rm(path.join(dirDefines.distDir, file), { recursive: true })
      )
    );
  }
  await fs.mkdir(dirDefines.distDir).safe();
}

main();
