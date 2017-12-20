import { ClipboardAction } from "types";
import { IDirectoryItem } from "models";

/** Describes an internal clipboard object. */
interface IItemClipboard {

    /** The directory item, if any. */
    directoryItem?: IDirectoryItem;

    /** The action to take on the directory item, if any. */
    clipboardAction?: ClipboardAction;
}

export default IItemClipboard;
