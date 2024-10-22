const path = require("path");

const projectDir = path.join(__dirname, "../../");
const distDir = path.join(projectDir, "dist");
const nodeModulesDir = path.join(projectDir, "node_modules");
const viteDir = path.join(projectDir, "app");
const releasesDir = path.join(projectDir, "releases");
const typesDir = path.join(projectDir, "@types");

const dirDefines = {
  projectDir,
  distDir,
  nodeModulesDir,
  viteDir,
  releasesDir,
  typesDir
};
module.exports = { dirDefines };
