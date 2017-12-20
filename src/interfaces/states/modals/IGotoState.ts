import { IDirectoryItem } from "models";

/** Describes the internal state of a Goto component. */
interface IGotoState {

    /** The search term displayed in the QuickSelect's input field. */
    searchTerm: string;

    /** The current directory of the Goto. */
    currentDirectory: string;

    /** The child directory items to show in the Goto. */
    directoryItems: IDirectoryItem[];

    /** The default value of the search field, if any. */
    quickSelectValue?: string;
}

export default IGotoState;
