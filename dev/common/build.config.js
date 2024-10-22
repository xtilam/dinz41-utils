const buildConfig = {
  BUILD_ARCHIVER_NAME: `resources.1.2.4${new Date()
    .toUTCString()
    .replace(/,/g, "")
    .replace(/[\s]/g, "_")
    .replace(/:/g, ".")}.7z`,
};

module.exports = { buildConfig };
