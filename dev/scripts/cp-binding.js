const path = require("path");
const { dirDefines } = require("../common/dir-define");
const fs = require("fs/promises");
const { existsSync } = require("fs");

const dd = dirDefines;
const str = JSON.stringify;

async function main() {
  const sqlite3 = require("sqlite3");
  const files = [sqlite3.path];

  const nativeDir = path.join(dd.projectDir, "data/native");
  if (!existsSync(nativeDir)) await fs.mkdir(nativeDir, { recursive: true });
  const code = `module.exports = {
    ${await Promise.all(
      files.map(async (filePath) => {
        const modulePath = filePath
          .slice(dd.nodeModulesDir.length)
          .split(path.sep)
          .filter((v) => v)
          .join("/");
        console.log({ modulePath });
        return `${str(path.basename(filePath))}: () => require(${str(
          modulePath
        )}),`;
      })
    )}
  }`;
  await fs.writeFile(
    path.join(dd.projectDir, "map-bindings.js"),
    code,
    "utf-8"
  );
  console.log(code);
}

main();
