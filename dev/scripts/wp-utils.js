require("../utils/promise-utils");

const path = require("path");
const { utils } = require("../utils/utils");
const { dirDefines } = require("../common/dir-define");
const fs = require("fs/promises");
const { existsSync, mkdirSync } = require("fs");

const missingPackageMSG =
  [
    `Missing args package:`,
    `\tex: -p [package_name]`,
    `\tex: --package [package_name]`,
  ].join("\n") + "\n";

const { log } = utils.LogTime("build_utils");

async function main() {
  const [long] = utils.args.read({ p: "package" }, true);
  const package = long.package?.[0];
  if (!package)
    return utils.args.missingArgs(
      "package",
      "-p [package_name]",
      "--package [package_name]"
    );
  const packageDir = path.join(dirDefines.projectDir, package);
  const [stat] = await fs.stat(packageDir).safe();
  if (!stat) return;
  if (!stat.isDirectory()) return;
  log("start build");
  await utils.exec.npm("build", packageDir);
  log("build done");
  log("package");
  if (!existsSync(dirDefines.distDir)) mkdirSync(dirDefines.distDir);
  await utils.exec.run(`npm pack --pack-destination=../dist`, packageDir);
  log("done");
}

main();
