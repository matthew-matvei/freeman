/** Describes system independent, terminal-related settings. */
interface ITerminalSettings {

    /** Whether the integrated terminal is shown when the application starts up. */
    displayAtStartup?: boolean;

    /** Whether to use a blinking cursor. */
    cursorBlink: boolean;

    /** Whether the integrated terminal should sync when changing directory. */
    syncNavigation: boolean;
}

export default ITerminalSettings;
