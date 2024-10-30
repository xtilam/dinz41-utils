import childProcess from "./child-process.mjs";
import { spawn } from "child_process";
import fs from "fs/promises";
import "../plugins/safe-promise.mjs";
import _7zbin from "7zip-bin";

// ----------------------------------------------
export default () => ({
  sevenZipArchive: {
    zipFolder: sevenZipFolder,
  },
});
// ----------------------------------------------
async function sevenZipFolder(sourceDir, destinationFilePath: string) {
  const [desStats] = await fs.stat(destinationFilePath).safe();
  const { waitTask } = childProcess();
  if (desStats) await fs.rm(destinationFilePath, { recursive: true });

  await waitTask(spawn(_7zbin.path7za, ["a", destinationFilePath, sourceDir]));
}
