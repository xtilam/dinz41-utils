"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.__dinz41ExtensionUtils_cli = void 0;
const extension = {
    cli: { args: parseArgs },
};
// ----------------------------------------------
function parseArgs(shortMap = {}, config) {
    const short = {};
    const long = {};
    const args = process.argv;
    return { long, short };
}
// ----------------------------------------------
class ArgsItem {
    constructor() {
        this.values = [];
    }
    get first() {
        return this.values[0];
    }
    get all() {
        return this.values;
    }
}
// ----------------------------------------------
const __dinz41ExtensionUtils_cli = () => extension;
exports.__dinz41ExtensionUtils_cli = __dinz41ExtensionUtils_cli;
