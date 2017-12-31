import { IDirectoryItem } from "models";
import { ItemType } from "types";

interface IDirectoryListState {

    /** The index of the selected item. */
    selectedIndex: number;

    /** The items within this directory (files, folders etc.). */
    directoryItems: IDirectoryItem[];

    /** The items chosen by the user for future actions. */
    chosenItems: IDirectoryItem[];

    /** Whether the directory pane should show hidden items. */
    showHiddenItems: boolean;

    /**
     * The type of item being created, or false if new file not being created.
     */
    creatingNewItem: ItemType | false;

    /** Whether the user is renaming an item. */
    renamingItem: boolean;

    /** Whether the user has just deleted an item. */
    itemDeleted: boolean;

    /** Whether the Goto modal window is open. */
    isGotoOpen: boolean;

    /** Whether the directory list has focus. */
    isFocused: boolean;
}

export default IDirectoryListState;
