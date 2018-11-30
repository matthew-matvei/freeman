import {
    IConfirmationSettings, IPersistenceSettings, ITerminalSettings, IUnixSettings, IWindowsSettings
} from "models/settings";

/** Describes settings for the application. */
interface ICommonSettings {

    /** Linux-specific settings. */
    linux: IUnixSettings;

    /** Windows-specific settings. */
    windows: IWindowsSettings;

    /** The name of the theme the application uses. */
    themeName: string;

    /** Confirmation-related settings. */
    confirmation: IConfirmationSettings;

    /** Settings related to the integrated terminal. */
    terminal: ITerminalSettings;

    /** Settings related to storing data. */
    persist: IPersistenceSettings;
}

export default ICommonSettings;
