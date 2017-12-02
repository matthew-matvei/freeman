import fs from "fs";
import path from "path";

import { ITheme } from "models";
import { ConfigManager } from "configuration";

/**
 * Manages parsing themes from application settings files.
 */
class ThemesManager {

    /**
     * A base config manager held as an instance variable.
     */
    private configManager: ConfigManager;

    /**
     * Initialises an instance of the KeysManager class.
     */
    public constructor() {
        this.configManager = new ConfigManager();
    }

    /**
     * Returns the application theme settings file.
     *
     * @param themeName - the name of the theme the application is using
     *
     * @returns - the application theme settings file
     */
    public retrieve(themeName: string): ITheme {
        return this.parseApplicationTheme(themeName);
    }

    /**
     * Returns the path to the theme file based on the given themeName.
     *
     * @param themeName - the name of the theme the application is using
     *
     * @returns - the path to the theme file based on the given themeName
     */
    private getThemesFile(themeName: string): string {
        return path.join(this.configManager.applicationName, "themes", `${themeName}.json`);
    }

    /**
     * Parses application theme file.
     *
     * @param themeName - the name of the theme to parse
     *
     * @returns - a full-formed theme object
     * @throws { Error } - when no application settings file is found
     */
    private parseApplicationTheme(themeName: string): ITheme {
        const fileName = path.join(
            this.configManager.applicationDataDirectory,
            this.getThemesFile(themeName));

        if (!fs.existsSync(fileName)) {
            Error(`${themeName} theme not found!`);
        }

        const applicationTheme = fs.readFileSync(fileName, "utf-8");
        return JSON.parse(applicationTheme);
    }
}

export default ThemesManager;
