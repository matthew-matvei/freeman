import { IParsedArguments } from "arguments";

/** Provides a static method for parsing command-line arguments. */
export default {

    /**
     * Parses command-line arguments
     *
     * @param args - the list of arguments to parse
     *
     * @returns a parsed object of command-line arguments
     */
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

/**
 * Returns whether the given arg identifies that the user has requested verbose mode
 *
 * @param arg - the argument to interpret
 *
 * @returns whether the given arg identifies that the user has requested verbose mode
 */
function verboseRequested(arg: string): boolean {
    return arg === "--verbose" || arg === "-V";
}

/**
 * Returns whether the given arg identifies that the user has requested version be shown
 *
 * @param arg - the argument to interpret
 *
 * @returns whether the given arg identifies that the user has requested version be shown
 */
function versionRequested(arg: string): boolean {
    return arg === "--version" || arg === "-v";
}
