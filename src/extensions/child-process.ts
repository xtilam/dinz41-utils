import { ChildProcess } from "child_process";

export default () => ({
  waitTask,
});

// ----------------------------------------------
function waitTask(task: ChildProcess) {
  return new Promise<void>((resolve, reject) => {
    const onClose = (code) => {
      if (code === 0) return resolve();
      setTimeout(() => reject(code), 20);
    };
    task.stdout?.on("data", (buffer) => process.stdout.write(buffer));
    task.stderr?.on("data", (buffer) => process.stderr.write(buffer));
    task.on("close", onClose);
    task.on("exit", onClose);
  });
}
