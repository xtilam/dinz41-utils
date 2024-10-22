const { spawn } = require("child_process");
const path = require("path");

const main = () => {
  const npx = { win32: "npx.cmd" }[process.platform] || "npx";
  const appDir = path.join(__dirname, "../");
  waitTask(spawn(npx, ["tsc", "--watch"], { cwd: appDir, shell: true }));
};

const waitTask = (task) => {
  return new Promise((resolve, reject) => {
    const onClose = (code) => {
      if (code === 0) return resolve();
      setTimeout(() => {
        reject(code);
      }, 20);
    };
    task.stdout.on("data", (buffer) => {
      if (buffer.length === 2) {
        const [b1, b2] = buffer;
        if (b1 === 27 && b2 === 99) return;
      }
      process.stdout.write(buffer);
    });
    task.stderr.on("data", (buffer) => {
      if (buffer.length === 2) {
        const [b1, b2] = buffer;
        if (b1 === 27 && b2 === 99) return;
      }
      process.stderr.write(buffer);
    });
    task.on("close", onClose);
    task.on("exit", onClose);
  });
};

main();
