(function () {
  Promise.prototype.safe = function () {
    return this.then(
      (value) => new PromiseError(value, undefined),
      (error) =>
        new PromiseError(undefined, error || new Error("Promise error"))
    );
  };
  Promise.safe = function (promise: any) {
    if (promise instanceof Promise) return promise.safe();
    return promise;
  };
  Promise.safeAll = function (values) {
    return Promise.all(values.map(Promise.safe as any)) as any;
  };
  // ----------------------------------------------
  class PromiseError<T, E> extends Array {
    constructor(value: T, error: E) {
      // @ts-ignore
      super(value, error);
    }
    get value() {
      return this[0] as T;
    }
    get error() {
      return this[1] as E;
    }
    get isDone() {
      return !this[1];
    }
    get isFailed() {
      return !!this[1];
    }
  }
})();
// ----------------------------------------------
