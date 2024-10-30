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
declare global {
  interface Promise<T> {
    safe<D = any>(): Promise<SafePromiseResult<T, D>>;
  }

  interface PromiseConstructor {
    safe<T>(promise: Promise<T>): Promise<SafePromiseResult<T>>;
    safeAll<T extends readonly unknown[] = []>(
      values: T
    ): Promise<{
      -readonly [P in keyof T]: SafePromiseResult<Awaited<T[P]>>;
    }>;
  }

  type SafePromiseResult<T, E = any> = readonly [T, E] & {
    readonly value: T;
    readonly error: E;
    readonly isDone: boolean;
    readonly isFailed: boolean;
  };
}
