import { injectable } from "inversify";
import path from "path";
const electron = require("electron");
const app = electron.app || electron.remote.app;

import { IDirectoryManager } from "managers";
import Utils from "Utils";

/** The base functionality of a configuration manager class. */
@injectable()
abstract class ConfigManager {

    /** A directory manager for reading user-defined key map files. */
    protected directoryManager: IDirectoryManager;

    /**
     * Initialises the base functionality of a ConfigManager class.
     *
     * @param directoryManager a directory manager for reading user-defined config files
     */
    public constructor(directoryManager: IDirectoryManager) {
        this.directoryManager = directoryManager;
    }

    /**
     * Parses user-specific settings file.
     *
     * @returns a fully-formed object of type T, or null if no settings could
     *      be read
     */
    protected parseFile<T>(fileName: string): T | null {
        const fullPath = path.join(app.getPath("userData"), fileName);

        try {
            const userKeys = this.directoryManager.readFileSync(fullPath);
            Utils.trace(`Retrieving settings from ${fileName}`);

            return JSON.parse(userKeys);
        } catch {
            Utils.trace(`Cannot parse settings from ${fileName}`);

            return null;
        }
    }
}

export default ConfigManager;
