import log from "electron-log";

/** An Error that is inherently logged. */
class LoggedError extends Error {

    /**
     * Initialises a new instance of the LoggedError class.
     *
     * @param args any arguments to send to the super constructor
     */
    constructor(...args: any[]) {
        super(...args);

        Error.captureStackTrace(this, LoggedError);

        log.error(this);
    }
}

export default LoggedError;
