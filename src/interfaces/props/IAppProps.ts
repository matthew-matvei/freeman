import {
    IDirectoryManager,
    IKeysManager,
    ISettingsManager,
    IThemesManager
} from "managers";

/** Describes properties for the App component. */
interface IAppProps {

    /** A manager that handles application settings. */
    settingsManager: ISettingsManager;

    /** A manager that handles key mappings. */
    keysManager: IKeysManager;

    /** A manager that handles the theme. */
    themeManager: IThemesManager;

    /** A manager that handles a user's directory. */
    directoryManager: IDirectoryManager;
}

export default IAppProps;
