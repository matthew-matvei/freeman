import fs from "fs";
import path from "path";

import applicationTheme from "configuration/internal/themes/dark";
import { ITheme } from "models";
import { IConfigManager } from "configuration";
import Utils from "Utils";

/** Manages parsing themes from application settings files. */
class ThemesManager {

    /** A base config manager held as an instance variable. */
    private configManager: IConfigManager;

    /**
     * Initialises an instance of the KeysManager class.
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
     * Retrieves application and user-specific theme settings files.
     *
     * @param themeName - the name of the theme the application is using
     *
     * @returns - the application theme settings file
     */
    public retrieve(themeName: string): ITheme {
        const userTheme = this.parseUserTheme("dark");

        return userTheme ? { ...applicationTheme, ...userTheme } : applicationTheme;
    }

    /**
     * Parses user-specific theme settings file.
     *
     * @param themeName - the name of the theme the application is using
     *
     * @returns - a fully-formed theme object, or null if no settings could
     *      be read
     */
    private parseUserTheme(themeName: string): ITheme | null {
        const fileName = path.join(
            this.configManager.userDataDirectory,
            "freeman.themes", `${themeName}.json`);

        if (!fs.existsSync(fileName)) {
            Utils.trace(`Cannot parse from non-existent file ${fileName}`);
            return null;
        }

        Utils.trace(`Retrieving user theme from ${fileName}`);

        const userTheme = fs.readFileSync(fileName, "utf-8");
        return JSON.parse(userTheme);
    }
}

export default ThemesManager;
