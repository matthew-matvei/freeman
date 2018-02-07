import { inject, injectable } from "inversify";
import path from "path";
const electron = require("electron");
const app = electron.app || electron.remote.app;

import TYPES from "ioc/types";
import { IDirectoryManager, ISettingsManager, IThemesManager } from "managers";
import { ITheme } from "models";
import applicationTheme from "settings/internal/themes/dark";
import Utils from "Utils";

/** Manages parsing themes from application settings files. */
@injectable()
class ThemesManager implements IThemesManager {

    /** A settings manager for retrieving theme name. */
    private settingsManager: ISettingsManager;

    /** A directory manager for reading the user theme file. */
    private directoryManager: IDirectoryManager;

    /** The internally held theme for this manager. */
    private _theme?: ITheme;

    /**
     * Initialises an instance of the KeysManager class.
     *
     * @param settingsManager - the settings manager providing application settings
     * @param directoryManager - a directory manager for reading user-defined key map files
     */
    public constructor(
        @inject(TYPES.ISettingsManager) settingsManager: ISettingsManager,
        @inject(TYPES.IDirectoryManager) directoryManager: IDirectoryManager) {

        if (!settingsManager) {
            throw new Error("Settings manager must be defined");
        }

        if (!directoryManager) {
            throw new Error("Directory manager must be defined");
        }

        this.settingsManager = settingsManager;
        this.directoryManager = directoryManager;
    }

    /** Gets the theme retrieved by the keys manager. */
    public get theme(): ITheme {
        if (!this._theme) {
            this._theme = this.retrieve(this.settingsManager.settings.themeName);
        }

        return this._theme;
    }

    /**
     * Retrieves application and user-specific theme settings files.
     *
     * @param themeName - the name of the theme the application is using
     *
     * @returns - the application theme settings file
     */
    private retrieve(themeName: string): ITheme {
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
            app.getPath("userData"),
            "freeman.themes", `${themeName}.json`);

        try {
            const userTheme = this.directoryManager.readFileSync(fileName);
            Utils.trace(`Retrieving user theme from ${fileName}`);

            return JSON.parse(userTheme);
        } catch {
            Utils.trace(`Cannot parse from non-existent file ${fileName}`);

            return null;
        }
    }
}

export default ThemesManager;
