const extension = {
  cli: { args: parseArgs },
};

// ----------------------------------------------
function parseArgs(shortMap = {}, config: {}) {
  type MapResult = Record<string, ArgsItem>;
  const short: MapResult = {};
  const long: MapResult = {};
  const args = process.argv;

  return { long, short };
}

// ----------------------------------------------
class ArgsItem {
  values = [];
  get first() {
    return this.values[0];
  }
  get all() {
    return this.values;
  }
}
// ----------------------------------------------
export const __dinz41ExtensionUtils_cli = () => extension;
