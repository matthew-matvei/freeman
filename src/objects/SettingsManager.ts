import fs from "fs";
import path from "path";

import { ISettings } from "models";
import { ConfigManager } from "objects";

class SettingsManager {

    /**
     * A base config manager held as an instance variable.
     */
    private configManager: ConfigManager;

    /**
     * Initialises an instance of the SettingsManager class.
     */
    public constructor() {
        this.configManager = new ConfigManager();
    }

    /**
     * Retrieves application and user-specific settings.
     *
     * @returns - a fully-formed settings object
     */
    public retrieve(): ISettings {
        const applicationSettings = this.parseApplicationSettings();
        const userSettings = this.parseUserSettings();
        if (userSettings) {
            return { ...applicationSettings, ...userSettings };
        }

        return applicationSettings;
    }

    /**
     * Parses application settings file.
     *
     * @returns - a fully-formed settings object
     * @throws { Error } - when no application settings file is found
     */
    private parseApplicationSettings(): ISettings {
        const fileName = path.join(
            this.configManager.applicationDataDirectory,
            this.configManager.applicationName,
            "settings.json");

        if (!fs.existsSync(fileName)) {
            Error("No application settings file found!");
        }

        const applicationSettings = fs.readFileSync(fileName, "utf-8");
        return JSON.parse(applicationSettings);
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
            this.configManager.applicationName,
            "settings.json");

        if (!fs.existsSync(fileName)) {
            return null;
        }

        const userSettings = fs.readFileSync(fileName, "utf-8");
        return JSON.parse(userSettings);
    }
}

export default SettingsManager;
