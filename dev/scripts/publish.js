const path = require("path");
const { utils } = require("../utils/utils");
const { dirDefines } = require("../common/dir-define");
const { existsSync } = require("fs");
const fs = require("fs/promises");
const clipboard = require('node-clipboard');

async function main() {
  const exec = utils.exec;
  const [args, s] = utils.args.read({ p: "package", b: "beta" });
  const tokenLoginPath = path.join(dirDefines.projectDir, "npm-token.txt");
  const package = args.package?.[0];
  const beta = args.beta?.[0];
  const npmToken = await fs.readFile(tokenLoginPath, "utf-8");
  const packageDir = path.join(dirDefines.projectDir, package);
  if (!existsSync(packageDir)) throw `Not found dir: ${packageDir}`;
  await exec.npm("build", packageDir);
  let publishCommand = `cd ${packageDir} && npm publish --access=public `;
  if (beta) publishCommand += ` --tag=${beta}-beta`;
  console.log(publishCommand);
  clipboard(publishCommand);
}

main();
