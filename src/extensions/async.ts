export default () => ({ asyncLoop, delay });
// ----------------------------------------------
function delay(timeout = 100) {
  return new Promise<void>((resolve) => setTimeout(resolve, timeout));
}

async function asyncLoop<T>(
  callback: (
    exit: <L>(value?: L) => L,
    next: (timeout?: number) => void
  ) => Promise<T>,
  delayTime = 100
): Promise<T> {
  let isExit = false;
  let nextTime = delayTime;

  while (true) {
    try {
      await callback(exit, next);
    } catch (error) {
      if (isExit) return error;
      throw error;
    }
    await delay(nextTime);
    nextTime = delayTime;
  }
  // ----------------------------------------------
  function exit(val: any): any {
    isExit = true;
    throw val;
  }
  function next(timeout = delayTime) {
    nextTime = timeout;
  }
}
