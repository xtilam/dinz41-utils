class _PromiseWrapper<T> extends Array implements IPromiseWrapper<T> {
  constructor() {
    super(3);
    this[0] = new Promise<T>((resolve, reject) => {
      this[1] = resolve;
      this[2] = reject;
    });
  }
  get promise(): Promise<T> {
    return this[0];
  }
  get resolve(): (value: T | PromiseLike<T>) => void {
    return this[1];
  }
  get reject(): (reason?: any) => void {
    return this[2];
  }
}

interface IPromiseWrapper<T> {
  get promise(): Promise<T>;
  get resolve(): (value: T | PromiseLike<T>) => void;
  get reject(): (reason?: any) => void;
}
export type PromiseWrapper<T> = readonly [T, any] & IPromiseWrapper<T>;
export default () => ({
  promise: {
    init: <T = void,>(): IPromiseWrapper<T> =>
      new _PromiseWrapper<T>() as any as PromiseWrapper<T>,
  },
});
