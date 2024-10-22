require("./promise-utils");
const __7zUtils = require("./extensions/7zip-utils");
const __argsUtils = require("./extensions/args-utils");
const { __utilsExtension__files } = require("./extensions/file-utils");
const { __utilsExtension__logTime } = require("./extensions/log-time");
const __taskUtils = require("./extensions/task-utils");
const __waitUtils = require("./extensions/wait-utils");

const utils = {
  ...__argsUtils(),
  ...__waitUtils(),
  ...__7zUtils(),
  ...__taskUtils(),
  ...__utilsExtension__logTime(),
  ...__utilsExtension__files(),
};

const settled = (v) => Promise.allSettled([v]);
module.exports = { utils, settled };
