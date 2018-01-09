import { ClipboardAction } from "types";
import { IDirectoryItem } from "models";

/** Describes an internal clipboard object. */
interface IItemClipboard {

    /** The directory items, if any. */
    directoryItems?: IDirectoryItem[];

    /** The action to take on the directory items, if any. */
    clipboardAction?: ClipboardAction;
}

export default IItemClipboard;
