import fs from "fs";
import { injectable } from "inversify";
import path from "path";
const electron = require("electron");
const app = electron.app || electron.remote.app;

import { ISettingsManager } from "managers";
import { ICommonSettings } from "models/settings";
import applicationSettings from "settings/internal/settings";
import Utils from "Utils";

/** Manages parsing settings from application settings files. */
@injectable()
class SettingsManager implements ISettingsManager {

    /** The internally held settings for this manager. */
    private _settings: ICommonSettings;

    /** Gets the settings retrieved by the settings manager. */
    public get settings(): ICommonSettings {
        if (!this._settings) {
            this._settings = this.retrieve();
        }

        return this._settings;
    }

    /**
     * Retrieves application and user-specific settings.
     *
     * @returns - a fully-formed settings object
     */
    private retrieve(): ICommonSettings {
        const userSettings = this.parseUserSettings();

        return userSettings ?
            { ...applicationSettings, ...userSettings } : applicationSettings;
    }

    /**
     * Parses user-specific settings file.
     *
     * @returns - a fully-formed settings object, or null if no settings could
     *      be read
     */
    private parseUserSettings(): ICommonSettings | null {
        const fileName = path.join(
            app.getPath("userData"),
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
