import deepmerge from "deepmerge";
import { inject, injectable } from "inversify";

import TYPES from "ioc/types";
import { IDirectoryManager, ISettingsManager } from "managers";
import ConfigManager from "managers/ConfigManager";
import { ICommonSettings } from "models/settings";
import applicationSettings from "settings/internal/settings";

/** Manages parsing settings from application settings files. */
@injectable()
class SettingsManager extends ConfigManager implements ISettingsManager {

    /** The internally held settings for this manager. */
    private _settings?: ICommonSettings;

    /**
     * Initialises an instance of the SettingsManager class.
     *
     * @param directoryManager a directory manager for reading user-defined key map files
     */
    public constructor(
        @inject(TYPES.IDirectoryManager) directoryManager: IDirectoryManager) {

        super(directoryManager);
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
        const userSettings = this.parseFile<ICommonSettings>("freeman.settings.json");

        return userSettings ? deepmerge(applicationSettings, userSettings) : applicationSettings;
    }
}

export default SettingsManager;
