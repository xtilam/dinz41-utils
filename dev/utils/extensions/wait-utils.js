const utils = {
  delay(timeout = 100){
    return new Promise(resolve=>setTimeout(resolve, timeout))
  },
  waitUntil(callback, delay = 20, timeout = 0) {
    const promise = new Promise((resolve, reject) => {
      let isReturn = false;
      let nextTimeout;
      executeCallback();

      if (timeout)
        setTimeout(() => {
          if (isReturn) return;
          clearTimeout(nextTimeout);
          isReturn = true;
          reject();
        }, timeout);

      async function executeCallback() {
        try {
          const data = await callback();
          if (!data) throw "continue";
          isReturn = true;
          return resolve(data);
        } catch (error) {}
        nextTimeout = setTimeout(executeCallback, delay);
      }
    });
    return promise;
  },
  debouncing: (onUpdate, timeout) => {
    const clearOldTimeout = () => {
      if (!curTimeout) return;
      clearTimeout(curTimeout);
      curTimeout = null;
    };
    // ----------------------------------------------
    let curTimeout = null;
    return [
      (...args) => {
        clearOldTimeout();
        curTimeout = setTimeout(() => {
          try {
            onUpdate(...args);
          } catch (error) {}
          clearOldTimeout();
        }, timeout);
      },
      clearOldTimeout,
    ];
  },
};

const __waitUtils = () => utils;
module.exports = __waitUtils;
