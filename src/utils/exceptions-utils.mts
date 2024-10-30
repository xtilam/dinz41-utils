// ----------------------------------------------
// Exception Utilities
// ----------------------------------------------

/**
 * Wraps a callback function with exception handling and returns an `ExceptionResult`.
 *
 * @param callback - The function to be executed.
 * @param declareException - A function to declare and register errors.
 * @returns The result of the callback execution, wrapped in an `ExceptionResult`.
 */
export const catchException: ExceptionHandler = ((callback) => {
  const resultWrapper = new ExceptionResult(undefined, undefined);

  const handleResultError = (err: any) => {
    if (err instanceof BaseError) {
      resultWrapper[1] = err;
    } else if (err instanceof Error) {
      resultWrapper[1] = Object.assign(err, {
        type: "EXECUTE_ERROR",
        EXECUTE_ERROR: err,
      });
    } else {
      resultWrapper[1] = new EXECUTE_ERROR(err);
    }
  };

  try {
    const result = callback();
    if (result instanceof Promise) {
      return result
        .then((res) => {
          resultWrapper[0] = res;
          return resultWrapper;
        })
        .catch((err) => {
          handleResultError(err);
          return resultWrapper;
        });
    } else {
      resultWrapper[0] = result;
      return resultWrapper;
    }
  } catch (err) {
    handleResultError(err);
    return resultWrapper;
  }
}) as any;

// ----------------------------------------------
// Exception Result
// ----------------------------------------------

/**
 * Represents the result of an operation that may include an error.
 *
 * @template T - Type of the result value.
 * @template E - Type of the error.
 */
class ExceptionResult<T, E> extends Array implements IExceptionResult<T, E> {
  constructor(value: T, error: E) {
    super(2);
    this[0] = value;
    this[1] = error;
  }
  get value(): T {
    return this[0];
  }
  get error(): E {
    return this[1];
  }
  throw() {
    if (this[1]) throw this[1];
  }
}

export class BaseError<N extends string = "EXECUTE_ERROR"> extends Error {
  declare type: N;
  protected declare _message: string;

  get message() {
    return this._message || this.type;
  }
  set(data: Partial<Omit<typeof this, keyof BaseError<N>>>) {
    Object.assign(this, data);
    return this;
  }
  protected _init(type: N) {
    this.type = type;
    this._message = type;
    Object.defineProperty(this, type, {
      get: function () {
        return this;
      },
    });
  }
}

class EXECUTE_ERROR extends BaseError<"EXECUTE_ERROR"> {
  static type = "EXECUTE_ERROR";
  declare EXECUTE_ERROR: typeof this;
  declare cause: Error;
  constructor(cause: Error) {
    super();
    this.cause = cause;
  }
  protected getMessage(): string {
    return this.type + `${this.cause?.message || `${this.cause}`}`;
  }
}

// ----------------------------------------------
// Error Registry
// ----------------------------------------------

/**
 * Manages a registry of custom error classes.
 *
 * @template T - Type of the registered errors.
 */
export class ErrorRegistry<T = {}> {
  add<D>(
    err: ((...args: any[]) => ErrorRegistry<D>) | ErrorRegistry<D>
  ): ErrorRegistry<T & D>;
  add<D>(
    cb: (...args: any[]) => Promise<ExceptionResultWrapper<any, D>>
  ): ErrorRegistry<T & D>;
  add<D>(
    cb: (...args: any[]) => ExceptionResultWrapper<any, D>
  ): ErrorRegistry<T & D>;
  add<E extends BaseError<any>>(
    errorClass: new (...args: any[]) => E
  ): ErrorRegistry<T & { [n in E["type"]]: E }>;
  add() {
    return this;
  }
}

// ----------------------------------------------
// Type Definitions
// ----------------------------------------------

interface IExceptionResult<T, E> {
  get value(): T;
  get error(): E;
  throw(): void;
}

// ----------------------------------------------
type ErrorPair<
  ERRCL extends BaseError<any> | (new (...args: any) => BaseError<string>)
> = ERRCL extends BaseError<any>
  ? [ERRCL["type"], ERRCL]
  : ERRCL extends new (...args: any) => BaseError<infer L>
  ? [L, InstanceType<ERRCL>]
  : ErrorPair<EXECUTE_ERROR>;

type ExceptionHandler = <
  RSCB,
  ERRS extends (BaseError<any> | (new (...args: any) => BaseError<any>))[],
  Result = IExceptionResult<
    Awaited<RSCB>,
    ObjToEntries<{
      [n in keyof ERRS]: ErrorPair<ERRS[n]>;
    }>
  >
>(
  callback: () => RSCB,
  errors?: ERRS
) => RSCB extends Promise<any> ? Promise<Result> : Result;

// ----------------------------------------------
type ExceptionResultWrapper<T, E> = IExceptionResult<
  T,
  E & { EXECUTE_ERROR: InstanceType<typeof EXECUTE_ERROR> }
> &
  [result: T, error: E & { EXECUTE_ERROR: InstanceType<typeof EXECUTE_ERROR> }];
type ObjToEntries<T extends readonly [string, any][]> = {
  -readonly [n in T[number][0]]: PickArrayEntry<n, T>;
};
type PickArrayEntry<
  K extends string,
  L extends readonly (readonly [string, any])[]
> = {
  readonly [n in keyof L]: L[n][0] extends K ? L[n][1] : never;
}[number];
