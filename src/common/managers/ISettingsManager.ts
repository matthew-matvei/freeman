import { ICommonSettings } from "models/settings";

/** The interface describing a SettingsManager. */
interface ISettingsManager {

    /** Gets the settings retrieved by the settings manager. */
    readonly settings: ICommonSettings;
}

export default ISettingsManager;
