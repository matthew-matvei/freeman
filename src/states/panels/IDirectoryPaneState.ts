import { IDirectoryItem } from "models";
import { ItemType } from "types";

/**
 * Describes the internal state of the DirectoryPane.
 */
interface IDirectoryPaneState {

    /**
     * The path to the directory the pane displays.
     */
    path: string;

    /**
     * The items within this directory (files, folders etc.).
     */
    directoryItems: IDirectoryItem[];

    /**
     * The index of the currently selected item.
     */
    selectedItem: number;

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

export default IDirectoryPaneState;
