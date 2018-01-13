import fs from "fs";
import path from "path";
import { inject, injectable } from "inversify";
const electron = require("electron");
const app = electron.app || electron.remote.app;

import applicationTheme from "settings/internal/themes/dark";
import { ITheme } from "models";
import Utils from "Utils";
import TYPES from "ioc/types";
import { ISettingsManager, IThemesManager } from "managers";

/** Manages parsing themes from application settings files. */
@injectable()
class ThemesManager implements IThemesManager {

    /** A settings manager for retrieving theme name. */
    private settingsManager: ISettingsManager;

    /** The internally held theme for this manager. */
    private _theme: ITheme;

    /**
     * Initialises an instance of the KeysManager class.
     *
     * @param settingsManager - the settings manager providing application settings
     */
    public constructor(
        @inject(TYPES.ISettingsManager) SettingsManager: ISettingsManager) {

        if (!SettingsManager) {
            throw new Error("Settings manager must be defined");
        }

        this.settingsManager = SettingsManager;
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
