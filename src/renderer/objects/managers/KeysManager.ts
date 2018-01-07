import fs from "fs";
import path from "path";

import applicationKeys from "configuration/internal/keys";
import { IKeyMap } from "models";
import { IConfigManager } from "configuration";
import Utils from "Utils";

/** Manages parsing key maps from application and user settings files. */
class KeysManager {

    /** A base configuration manager held as an instance variable. */
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
     * Retrieves application and user-specific key map settings files.
     *
     * @returns - a fully-formed key map object, or null if no settings could
     *      be read
     */
    public retrieve(): IKeyMap {
        const userKeys = this.parseUserKeys();

        return userKeys ? { ...applicationKeys, ...userKeys } : applicationKeys;
    }

    /**
     * Parses user-specific key map settings file.
     *
     * @returns - a fully-formed key map object, or null if no settings could
     *      be read
     */
    private parseUserKeys(): IKeyMap | null {
        const fileName = path.join(
            this.configManager.userDataDirectory,
            "freeman.keys.json");

        if (!fs.existsSync(fileName)) {
            Utils.trace(`Cannot parse key map from non-existent file ${fileName}`);
            return null;
        }

        Utils.trace(`Retrieving user keys from ${fileName}`);

        const userKeys = fs.readFileSync(fileName, "utf-8");
        return JSON.parse(userKeys);
    }
}

export default KeysManager;
