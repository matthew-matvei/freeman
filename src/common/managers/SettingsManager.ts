import deepmerge from "deepmerge";
import { inject, injectable } from "inversify";
import path from "path";
const electron = require("electron");
const app = electron.app || electron.remote.app;

import TYPES from "ioc/types";
import { IDirectoryManager, ISettingsManager } from "managers";
import { ICommonSettings } from "models/settings";
import applicationSettings from "settings/internal/settings";
import Utils from "Utils";

/** Manages parsing settings from application settings files. */
@injectable()
class SettingsManager implements ISettingsManager {

    /** The internally held settings for this manager. */
    private _settings?: ICommonSettings;

    /** The directory manager used to read user-defined settings file. */
    private directoryManager: IDirectoryManager;

    /**
     * Initialises an instance of the SettingsManager class.
     *
     * @param directoryManager a directory manager for reading user-defined key map files
     */
    public constructor(
        @inject(TYPES.IDirectoryManager) directoryManager: IDirectoryManager) {

        if (!directoryManager) {
            throw new ReferenceError("Directory manager must be defined");
        }

        this.directoryManager = directoryManager;
    }

    /** @inheritDoc */
    public get settings(): ICommonSettings {
        if (!this._settings) {
            this._settings = this.retrieve();
        }

        return this._settings;
    }

    /**
     * Retrieves application and user-specific settings.
     *
     * @returns a fully-formed settings object
     */
    private retrieve(): ICommonSettings {
        const userSettings = this.parseUserSettings();

        return userSettings ? deepmerge(applicationSettings, userSettings) : applicationSettings;
    }

    /**
     * Parses user-specific settings file.
     *
     * @returns a fully-formed settings object, or null if no settings could
     *      be read
     */
    private parseUserSettings(): ICommonSettings | null {
        const fileName = path.join(
            app.getPath("userData"),
            "freeman.settings.json");

        try {
            const userSettings = this.directoryManager.readFileSync(fileName);
            Utils.trace(`Retrieving user settings from ${fileName}`);

            return JSON.parse(userSettings);
        } catch {
            Utils.trace(`Cannot parse settings from ${fileName}`);

            return null;
        }
    }
}

export default SettingsManager;
