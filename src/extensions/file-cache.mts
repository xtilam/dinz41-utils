import { readFileSync, writeFileSync } from "fs";
import path from "path";

export class FileCache<T> {
  path = "";
  private _data: T = {} as any;
  private _filters: Partial<{ [n in keyof T]: (value: any) => T[n] }> = {};

  // ----------------------------------------------
  get data() {
    return this._data;
  }
  constructor(
    filePath: string,
    filters?: Parameters<FileCache<T>["applyFilter"]>[0]
  ) {
    this.path = filePath;
    if (filters) this.applyFilter(filters);
  }
  assign(data: Partial<T>) {
    for (const key in data) {
      this._setData(key, data[key]);
    }
    return this;
  }
  read() {
    let value, error;
    try {
      value = JSON.parse(readFileSync(this.path, "utf-8"));
    } catch (err) {
      err = err;
    }
    // console.log("dèalut value", { value, error });
    if (!error) this.assign(value);
    for (const key in this._filters) {
      if (!this._data.hasOwnProperty(key)) {
        this._setData(key, this._data[key]);
        console.log(key, this._data[key]);
      }
    }
    return this;
  }
  clear() {
    for (const key in this._data) {
      delete this._data[key];
    }
    return this;
  }
  writeField(data: any, field: keyof T) {
    this._setData(field, data);
    return this;
  }
  write() {
    writeFileSync(this.path, JSON.stringify(this._data));
    return this;
  }
  applyFilter(
    filter: (
      api: typeof apiFilter
    ) => Partial<{ [n in keyof T]: AllowArray<(value: any) => T[n]> }>
  ) {
    const newFilter = filter(apiFilter);
    for (const key in newFilter) {
      const filter = newFilter[key];
      if (Array.isArray(filter)) newFilter[key] = mergeFilter.bind(0, filter);
    }
    Object.assign(this._filters, newFilter);
    const { _data } = this;
    for (const key in newFilter) {
      this._setData(key, _data[key]);
    }
    return this;
  }
  private _setData(key: keyof T, value: any) {
    const filter = this._filters[key];
    if (filter) value = filter(value);
    this._data[key] = value;
  }
}

// ----------------------------------------------
const apiFilter = {
  string(v): string {
    return v ? v + "" : "";
  },
  trim(v): string {
    return v ? (v + "").trim() : "";
  },
  number(v): number {
    return Number(v);
  },
  finite(v): number {
    v = Number(v);
    return Number.isFinite(v) ? v : 0;
  },
  min:
    (minNumber: number) =>
    (v): number => {
      v = apiFilter.finite(v);
      if (v < 0) return minNumber;
      return v;
    },
  max:
    (maxNumber: number) =>
    (v): number => {
      v = apiFilter.finite(v);
      if (v > 0) return maxNumber;
      return v;
    },
  range: (range: { min?: number; max?: number }) => {
    const { min, max } = range;
    const hasMin = Number.isFinite(min);
    const hasMax = Number.isFinite(max);
    return (v): number => {
      v = apiFilter.finite(v);
      if (hasMin && v < min) return min;
      if (hasMax && v > max) return max;
      return v;
    };
  },
  boolean: Boolean,
  default: (defaultVal: any) => (v) => v === undefined ? defaultVal : v,
  listFilter: (callback: (v) => any) => (list: any) => {
    if (!Array.isArray(list)) return [];
    return list.filter(callback);
  },
};

const mergeFilter = (listFilter: any[], val) =>
  listFilter.reduce((val, callback) => callback(val), val);

// ----------------------------------------------
let baseDir = __dirname;

const setupDir = (dir: string) => (baseDir = dir);
const initFileCache = <T,>(
  name: string,
  filters?: ConstructorParameters<typeof FileCache<T>>[1]
) => {
  const cache = new FileCache<T>(path.join(baseDir, `${name}.json`), filters);
  cache.read();
  return cache.write();
};
// ----------------------------------------------
export default () => ({
  fileCache: {
    init: initFileCache,
    setupDir,
  },
});

// ----------------------------------------------
type AllowArray<T> = T | T[];
