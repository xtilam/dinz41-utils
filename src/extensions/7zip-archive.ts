import childProcess from "./child-process";
import { spawn } from "child_process";
import { getLibs } from "../safe-libs";
import fs from "fs/promises";
import "../plugins/safe-promise";

const libs = getLibs({
  "7zip-bin": () => require("7zip-bin"),
});
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

  await waitTask(
    spawn(libs["7zip-bin"].path7za, ["a", destinationFilePath, sourceDir])
  );
}
