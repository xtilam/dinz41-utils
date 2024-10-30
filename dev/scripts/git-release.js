const path = require("path");
const { utils } = require("../utils/utils");
const { dirDefines } = require("../common/dir-define");
const { existsSync } = require("fs");
const fs = require("fs/promises");

async function main() {
  const { read: readArgs, missingArgs } = utils.args;
  const exec = utils.exec.run;
  const { log } = utils.LogTime();

  const defaultVersion = (
    await utils.file.readJSON(path.join(dirDefines.projectDir, "package.json"))
  ).version;

  const [args] = readArgs({ v: "version" });
  const versionUp = args.version?.[0] || defaultVersion;

  if (!versionUp)
    return missingArgs("version", "-v, --version: release version");

  const packageJSON = await utils.file.readJSON(
    path.join(dirDefines.projectDir, "package.json")
  );
  const distBuildTgzPath = path.join(
    dirDefines.distDir,
    `${packageJSON.name}-${packageJSON.version}.tgz`
  );
  if (existsSync(distBuildTgzPath)) await fs.rm(distBuildTgzPath);
  await exec("npm pack", dirDefines.distDir);

  const releaseName = path.basename(distBuildTgzPath);
  const uploadCLI = `gh release upload ${versionUp} ${distBuildTgzPath}`;
  const deleteCLI = `gh release delete-asset ${versionUp} ${releaseName}`;
  log("delete", releaseName);
  await exec(deleteCLI).safe();
  log("upload", distBuildTgzPath);
  await exec(uploadCLI);
  await fs.rm(distBuildTgzPath)
  log('done')
}
main();
