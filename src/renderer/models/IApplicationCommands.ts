/** Describes application-level commands. */
interface IApplicationCommands {

    /** Reloads the BrowserWindow. */
    reloadWindow: () => void;

    /** Defines how properties of IApplicationCommands are indexed. */
    [commandName: string]: () => void;
}

export default IApplicationCommands;
