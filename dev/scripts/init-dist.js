const { existsSync, rmSync, mkdir, mkdirSync, writeFileSync } = require("fs");
const { dirDefines } = require("../common/dir-define");
const { exit } = require("process");
const { scriptDefine } = require("../common/script-define");
const path = require("path");
const { execSync, exec } = require("child_process");
const { copyNativeModules } = require("../actions/copy-native-modules");

const distPackageJSON = path.join(dirDefines.distDir, "package.json");

async function main() {
  if (!existsSync(dirDefines.distDir)) {
    mkdirSync(dirDefines.distDir);
  }
  writePackageJSON();
  await writeLibs();
  writeElectronJS();
}

async function writeLibs() {
  if (existsSync(scriptDefine.distLibsJSPath)) return;
  execSync("npm run wp-libs-dev", {
    cwd: dirDefines.projectDir,
    shell: true,
    stdio: "inherit",
  });
  await copyNativeModules();
}
function writePackageJSON() {
  if (existsSync(distPackageJSON)) return;
  execSync("npx yarn init -y", {
    cwd: dirDefines.distDir,
    shell: true,
    stdio: "inherit",
  });
}
function writeElectronJS() {
  if (existsSync(scriptDefine.distElectronJSPath)) return;
  writeFileSync(
    scriptDefine.distElectronJSPath,
    "console.log('wait compile electron.js')",
    "utf-8"
  );
}

main();
