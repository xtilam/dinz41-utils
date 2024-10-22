const path = require("path");
const { existsSync } = require("fs");
const { utils } = require("../utils/utils");
const { exec } = require("child_process");
const { dirDefines } = require("../common/dir-define");

async function main() {
  const [map] = utils.args.read({ s: "script", mon: "nodemon" }, true);

  const script = (map.script[0] || "").trim();
  const isRunNodeMon = map.nodemon?.[0];

  const scriptPath = path.join(__dirname, script + ".js");
  if (!existsSync(scriptPath)) throw new Error(`Not found ${scriptPath}`);
  const argsString = findArgs().join(" ");
  const scriptRun = `node ${scriptPath} ${argsString}`;

  if (!isRunNodeMon) {
    utils.exec.run(scriptRun).safe();
  } else {
    utils.exec.run(
      `nodemon ${scriptPath} --watch ${path.join(
        dirDefines.projectDir,
        "dev"
      )} --exec ${JSON.stringify(scriptRun)}`
    );
  }

  function findArgs() {
    return process.argv.slice((isRunNodeMon ? 1 : 0) + 4);
  }
}

main();
