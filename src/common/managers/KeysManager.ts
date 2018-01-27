import { inject, injectable } from "inversify";
import path from "path";
const electron = require("electron");
const app = electron.app || electron.remote.app;

import TYPES from "ioc/types";
import { IDirectoryManager, IKeysManager } from "managers";
import { IKeyMap } from "models";
import applicationKeys from "settings/internal/keys";
import Utils from "Utils";

/** Manages parsing key maps from application and user settings files. */
@injectable()
class KeysManager implements IKeysManager {

    /** The internally held key map for this manager. */
    private _keyMap: IKeyMap;

    /** The directory manager used to read user-defined key map file. */
    private directoryManager: IDirectoryManager;

    /**
     * Initialises an instance of the KeysManager class.
     *
     * @param directoryManager - a directory manager for reading user-defined key map files
     */
    public constructor(
        @inject(TYPES.IDirectoryManager) directoryManager: IDirectoryManager) {

        if (!directoryManager) {
            throw new ReferenceError("Directory manager must be defined");
        }

        this.directoryManager = directoryManager;
    }

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

        try {
            const userKeys = this.directoryManager.readFileSync(fileName);
            Utils.trace(`Retrieving user keys from ${fileName}`);

            return JSON.parse(userKeys);
        } catch {
            Utils.trace(`Cannot parse key map from ${fileName}`);

            return null;
        }
    }
}

export default KeysManager;
