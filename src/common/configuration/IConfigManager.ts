/** The interface describing a ConfigManager. */
interface IConfigManager {

    /** Gets the path to the user-specific data directory. */
    readonly userDataDirectory: string;

    /** Gets the name of this application. */
    readonly applicationName: string;
}

export default IConfigManager;
