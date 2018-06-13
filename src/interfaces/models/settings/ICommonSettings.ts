import { IConfirmationSettings, ITerminalSettings, IUnixSettings, IWindowsSettings } from "models/settings";

/** Describes settings for the application. */
interface ICommonSettings {

    /** Linux-specific settings. */
    linux: IUnixSettings;

    /** Windows-specific settings. */
    windows: IWindowsSettings;

    /** Whether to start the application maximised. */
    maximised: boolean;

    /** The name of the theme the application uses. */
    themeName: string;

    /** Confirmation-related settings. */
    confirmation: IConfirmationSettings;

    /** Settings related to the integrated terminal. */
    terminal: ITerminalSettings;
}

export default ICommonSettings;
