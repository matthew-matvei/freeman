import fs from "fs";
import path from "path";

import { ITheme } from "models";
import { IConfigManager } from "configuration";

/**
 * Manages parsing themes from application settings files.
 */
class ThemesManager {

    /**
     * A base config manager held as an instance variable.
     */
    private configManager: IConfigManager;

    /**
     * Initialises an instance of the KeysManager class.
     *
     * @param configManager - the configuration manager providing helper properties
     */
    public constructor(configManager: IConfigManager) {

        if (!configManager) {
            throw Error("Config manager must be defined");
        }

        this.configManager = configManager;
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

    /** Useful for creating a populated ITheme object for testing purposes. */
    public static fake(): ITheme {
        return {
            directoryItem: {
                backgroundColour: "black",
                chosenColour: "black",
                colour: "black",
                directoryColour: "black",
                fileColour: "black",
                selectedColour: "black"
            },
            pathPanel: {
                backgroundColour: "black"
            },
            primaryBackgroundColour: "black",
            primaryColour: "black",
            quickSelect: {
                backgroundColour: "black",
                colour: "black",
                selectedColour: "black"
            },
            statusBar: {
                backgroundColour: "black"
            }
        }
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
