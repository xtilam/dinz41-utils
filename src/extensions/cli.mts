export default () => ({
  cli: { parseArgs },
});

// ----------------------------------------------
function parseArgs(shortMap = {}) {
  type MapResult = Record<string, ArgsItem>;
  const short: MapResult = {};
  const long: MapResult = {};
  // ----------------------------------------------
  const args = process.argv;
  let idx = 0;
  while (idx < args.length) {
    const value = args[idx];
    const paramLength = getParamLength(value);
    if (!paramLength) {
      ++idx;
      continue;
    }
    let key = value.slice(paramLength);
    let list = long;
    let [rs, nextIdx] = getNextValues(idx + 1);
    idx = nextIdx;
    if (paramLength === 1) {
      if (shortMap[key]) key = shortMap[key];
      else list = short;
    }
    const item = list[key] || (list[key] = new ArgsItem());
    item.all.push(...rs);
  }

  return [long, short];
  // ----------------------------------------------

  function getNextValues(idx: number) {
    const rs = [] as any[];
    while (idx < args.length) {
      if (getParamLength(args[idx])) break;
      rs.push(args[idx]);
      ++idx;
    }
    if (!rs.length) rs.push(true);
    return [rs, idx] as const;
  }
  function getParamLength(val: string) {
    if (!val) return 0;
    if (val.at(0) !== "-") return 0;
    if (val.at(1) !== "-") return 1;
    return 2;
  }
}

// ----------------------------------------------
class ArgsItem {
  values = [] as any[];
  get first() {
    return this.values[0];
  }
  get all() {
    return this.values;
  }
}
