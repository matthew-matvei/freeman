import fs from "fs";
import { injectable } from "inversify";
import path from "path";
const electron = require("electron");
const app = electron.app || electron.remote.app;

import { IKeysManager } from "managers";
import { IKeyMap } from "models";
import applicationKeys from "settings/internal/keys";
import Utils from "Utils";

/** Manages parsing key maps from application and user settings files. */
@injectable()
class KeysManager implements IKeysManager {

    /** The internally held key map for this manager. */
    private _keyMap: IKeyMap;

    /** Gets the key map retrieved by the keys manager. */
    public get keyMap(): IKeyMap {
        if (!this._keyMap) {
            this._keyMap = this.retrieve();
        }

        return this._keyMap;
    }

    /**
     * Retrieves application and user-specific key map settings files.
     *
     * @returns - a fully-formed key map object, or null if no settings could
     *      be read
     */
    private retrieve(): IKeyMap {
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
            app.getPath("userData"),
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
