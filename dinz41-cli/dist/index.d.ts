declare function parseArgs(shortMap: {}, config: {}): {
    long: Record<string, ArgsItem>;
    short: Record<string, ArgsItem>;
};
declare class ArgsItem {
    values: any[];
    get first(): any;
    get all(): any[];
}
export declare const __dinz41ExtensionUtils_cli: () => {
    cli: {
        args: typeof parseArgs;
    };
};
export {};
