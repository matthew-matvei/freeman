import { IParsedArguments } from "arguments";

export default {
    parse(args: string[]): IParsedArguments {
        const result: IParsedArguments = {
            verbose: false,
            version: false
        };

        args.forEach(arg => {
            if (versionRequested(arg)) {
                result.version = true;
            } else if (verboseRequested(arg)) {
                result.verbose = true;
            }
        });

        return result;
    }
};

function verboseRequested(arg: string): boolean {
    return arg === "--verbose" || arg === "-V";
}

function versionRequested(arg: string): boolean {
    return arg === "--version" || arg === "-v";
}
