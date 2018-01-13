import { IWindowsSettings, IUnixSettings } from "models/settings";

/** Describes settings for the application. */
interface ICommonSettings {

    /** Linux-specific settings. */
    linux: IUnixSettings;

    /** Windows-specific settings. */
    windows: IWindowsSettings;

    /** Whether to start the application in full-screen mode. */
    fullscreen: boolean;

    /** The name of the theme the application uses. */
    themeName: string;
}

export default ICommonSettings;
