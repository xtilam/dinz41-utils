const { ChildProcess } = require("child_process");

const utils = { waitTask };
const __taskUtils = () => utils;
module.exports = __taskUtils;
// ----------------------------------------------
/**
 *
 * @param {ChildProcess} task
 * @returns {Promise<any>}
 */
function waitTask(task) {
  return new Promise((resolve, reject) => {
    const onClose = (code) => {
      if (code === 0) return resolve();
      setTimeout(() => {
        reject(code);
      }, 20);
    };
    task.stdout?.on("data", (buffer) => process.stdout.write(buffer));
    task.stderr?.on("data", (buffer) => process.stderr.write(buffer));
    task.on("close", onClose);
    task.on("exit", onClose);
  });
}
