import { Stats } from "fs";
import fs from "fs/promises";
import md5 from "md5";
import md5File from "md5-file";

/**
 *
 * @param filePath
 * @param newContent
 * @returns return file written or not
 */
const writeMD5File = async (filePath: string, newContent: string) => {
  const writeFile = () => {
    console.log(`DEBUG::writeFile::${filePath}`);
    return fs.writeFile(filePath, newContent, "utf-8");
  };
  // ----------------------------------------------
  const check = await checkFilePath(filePath);

  if (!check.stat || check.clean) {
    await check.clean?.();
    await writeFile();
    return true;
  }

  const md5Content = md5(newContent);
  if (md5Content === (await md5File(filePath))) return false;
  await writeFile();
  return true;
};

const createFileMD5 = (filePath: string, newContent = "") => {
  const setContent = (content) => (newContent = content);
  const write = (content = newContent) => writeMD5File(filePath, content);
  const isValid = async () => {
    const check = await checkFilePath(filePath);
    if (!check.stat || check.clean) return false;
    const md5Content = md5(newContent);
    if (md5Content !== (await md5File(filePath))) return false;
    return true;
  };
  const rs = { setContent, write, isValid };
  return rs;
};

// ----------------------------------------------
const checkFilePath = async (
  filePath: string
): Promise<{ stat: Stats; clean?: () => Promise<void> }> => {
  const stat = (await fs.stat(filePath).safe()).value;

  if (!stat) return { stat };
  if (stat.isDirectory())
    return { stat, clean: () => fs.rm(filePath, { recursive: true }) };
  return { stat };
};

// ----------------------------------------------
export default () => ({
  md5,
  md5File: {
    getMd5File: md5File,
    write: writeMD5File,
    file: createFileMD5,
  },
});
