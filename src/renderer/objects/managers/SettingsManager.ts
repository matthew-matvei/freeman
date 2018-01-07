import fs from "fs";
import path from "path";

import applicationSettings from "configuration/internal/settings";
import { ISettings } from "models";
import { IConfigManager } from "configuration";
import Utils from "Utils";

/** Manages parsing settings from application settings files. */
class SettingsManager {

    /** A base config manager held as an instance variable. */
    private configManager: IConfigManager;

    /**
     * Initialises an instance of the SettingsManager class.
     *
     * @param configManager - the configuration manager providing helper properties
     */
    public constructor(configManager: IConfigManager) {

        if (!configManager) {
            throw new Error("Config manager must be defined");
        }

        this.configManager = configManager;
    }

    /**
     * Retrieves application and user-specific settings.
     *
     * @returns - a fully-formed settings object
     */
    public retrieve(): ISettings {
        const userSettings = this.parseUserSettings();

        return userSettings ? { ...applicationSettings, ...userSettings } : applicationSettings;
    }

    /**
     * Parses user-specific settings file.
     *
     * @returns - a fully-formed settings object, or null if no settings could
     *      be read
     */
    private parseUserSettings(): ISettings | null {
        const fileName = path.join(
            this.configManager.userDataDirectory,
            "freeman.settings.json");

        if (!fs.existsSync(fileName)) {
            Utils.trace(`Cannot parse settings from non-existent file ${fileName}`);
            return null;
        }

        Utils.trace(`Retrieving user settings from ${fileName}`);

        const userSettings = fs.readFileSync(fileName, "utf-8");
        return JSON.parse(userSettings);
    }
}

export default SettingsManager;
