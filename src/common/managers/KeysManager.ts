import deepmerge from "deepmerge";
import { inject, injectable } from "inversify";
import TYPES from "ioc/types";
import { IDirectoryManager, IKeysManager } from "managers";
import Manager from "managers/Manager";
import { IKeyMap } from "models";
import applicationKeys from "settings/internal/keys";

/** Manages parsing key maps from application and user settings files. */
@injectable()
class KeysManager extends Manager implements IKeysManager {

    /** The internally held key map for this manager. */
    private _keyMap?: IKeyMap;

    /**
     * Initialises an instance of the KeysManager class.
     *
     * @param directoryManager a directory manager for reading user-defined key map files
     */
    public constructor(
        @inject(TYPES.IDirectoryManager) directoryManager: IDirectoryManager) {

        super(directoryManager);
    }

    /** @inheritDoc */
    public get keyMap(): IKeyMap {
        if (!this._keyMap) {
            this._keyMap = this.retrieve();
        }

        return this._keyMap;
    }

    /**
     * Retrieves application and user-specific key map settings files.
     *
     * @returns a fully-formed key map object
     */
    private retrieve(): IKeyMap {
        const userKeys = this.parseFile<IKeyMap>("freeman.keys.json");

        return userKeys ?
            deepmerge(applicationKeys, userKeys, { arrayMerge: (destination: any[], source: any[]) => source }) :
            applicationKeys;
    }
}

export default KeysManager;
