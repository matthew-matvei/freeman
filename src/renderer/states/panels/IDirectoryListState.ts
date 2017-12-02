import { IDirectoryItem } from "models";
import { ItemType } from "types";

interface IDirectoryListState {

    selectedItem: number;


    /**
     * The items within this directory (files, folders etc.).
     */
    directoryItems: IDirectoryItem[];

    /**
     * Whether the directory pane should show hidden items.
     */
    showHiddenItems: boolean;

    /**
     * The type of item being created, or false if new file not being created.
     */
    creatingNewItem: ItemType | false;

    /**
     * Whether the user is renaming an item.
     */
    renamingItem: boolean;

    /**
     * Whether the user has just deleted an item.
     */
    itemDeleted: boolean;
}

export default IDirectoryListState;
