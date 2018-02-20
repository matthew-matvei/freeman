/** Describes system independent, terminal-related settings. */
interface ITerminalSettings {

    /** Whether the integrated terminal is shown when the application starts up. */
    displayAtStartup: boolean;

    /** Whether to use a blinking cursor. */
    cursorBlink: boolean;
}

export default ITerminalSettings;
