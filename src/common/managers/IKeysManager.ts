import { IKeyMap } from "models";

/** The interface describing a KeysManager. */
interface IKeysManager {

    /** Gets the key map retrieved by the keys manager. */
    readonly keyMap: IKeyMap;
}

export default IKeysManager;
