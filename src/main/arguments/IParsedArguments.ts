/** Describes consisely which command-line arguments have been given. */
interface IParsedArguments {
    verbose: boolean;
    version: boolean;
    openInDevelopment: boolean;
}

export default IParsedArguments;
