function LogTime(preFix = "", max = 100, fill = "-") {
  const initTime = new Date().getTime();
  preFix = preFix ? `${preFix}::` : "";
  return { log, setTime };
  // ----------------------------------------------
  function log(log = "", ...subLog) {
    const timeSpace = new Date().getTime() - initTime;
    log = `${preFix}${log}`;
    log = log.replace(/\s/g, "_").toUpperCase();
    log = `${log} `;
    let endLog = `[${timeSpace} ${"ms"}]`;
    log = "+- " + log;
    log = log.padEnd(max - endLog.length, fill) + endLog;
    console.log(log.green);
    subLog.forEach((v) => console.log(`  +-${v}`.blue));
  }
  function setTime() {
    initTime = new Date().getTime();
  }
}

const __utilsExtension__logTime = () => ({ LogTime });
module.exports = { __utilsExtension__logTime };
