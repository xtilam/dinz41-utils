const { exec } = require("child_process");
const { dirDefines } = require("../../common/dir-define");
const __taskUtils = require("./task-utils");

require("colors");
/** @type {(mapShort = any)=>[long: any, short: any]} */
const readArgsParams = (mapShort = {}) => {
  const arrayMode = true;

  const push = arrayMode
    ? (list, key, val) => {
        const listValue = list[key] || (list[key] = []);
        listValue.push(val);
      }
    : (list, key, val) => {
        list[key] = val;
      };
  const getParamLength = (value) => {
    if (!value) return 0;
    if (value.at(0) !== "-") return 0;
    if (value.at(1) !== "-") return 1;
    return 2;
  };

  // ----------------------------------------------
  const args = process.argv;
  const short = {};
  const long = {};

  for (let i = 0; i < args.length; i++) {
    const value = args[i];
    const paramLength = getParamLength(value);
    if (!paramLength) continue;
    let key = value.slice(paramLength);
    let list = long;
    let val = args[i + 1];
    if (getParamLength(val)) val = true;
    else ++i;

    if (paramLength === 1) {
      if (mapShort[key]) key = mapShort[key];
      else list = short;
    }
    push(list, key, val);
  }
  return [long, short];
};

function missingArgs(name = "", ...example) {
  const message =
    [
      `Missing args ${JSON.stringify(name).red}:`,
      ...example.map((v) => `  Ex: ${v}`),
    ].join("\n") + "\n";
  console.log(message);
  return process.exit(1);
}

async function run(shell, cwd = dirDefines.projectDir, other = {}) {
  if (!other) other = {};
  if (!other.env) other.env = { ...process.env };
  return await __taskUtils().waitTask(
    exec(shell, { cwd, shell: true, ...other })
  );
}
async function npm(shell, cwd = dirDefines.projectDir, other = {}) {
  shell = `npm run ` + shell;
  return run(shell, cwd, other);
}
async function npx(shell, cwd = dirDefines.projectDir, other = {}) {
  shell = `npx ` + shell;
  return run(shell, cwd, other);
}

// ----------------------------------------------
const extension = () => ({
  args: { read: readArgsParams, missingArgs },
  exec: {
    run,
    npm,
    npx,
  },
});
const __argsUtils = () => extension();
module.exports = __argsUtils;
