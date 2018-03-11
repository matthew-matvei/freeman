import os from "os";

import LoggedError from "errors/LoggedError";

/** An Error thrown during directory-related operations. */
class DirectoryError extends LoggedError {

    /**
     * Initialises a new instance of the DirectoryError class.
     *
     * @param message the message to display in the thrown error
     * @param sourcePath the source path, if any, to display
     * @param destinationPath the destination path, if any, to display
     */
    constructor(message: string, sourcePath?: string, destinationPath?: string) {
        super(DirectoryError.constructErrorMessage(message, sourcePath, destinationPath));

        Error.captureStackTrace(this, DirectoryError);
    }

    /**
     * Constructs the full error message based on the given message and optional paths.
     *
     * @param message the message to include in the error message
     * @param sourcePath the source path to include
     * @param destinationPath the destination path to include
     */
    private static constructErrorMessage(message: string, sourcePath?: string, destinationPath?: string): string {
        let result = message;

        if (sourcePath) {
            result += `${os.EOL}Source directory item: ${sourcePath}`;
        }

        if (destinationPath) {
            result += `${os.EOL}Destination directory item: ${destinationPath}`;
        }

        return result;
    }
}

export default DirectoryError;
