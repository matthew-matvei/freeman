import { ItemType } from "types";
import { IDirectoryItem } from "models";

/**
 * Describes the properties of a directory input item component.
 */
interface IInputItemProps {

    /**
     * The type of item being created, if any.
     */
    creatingItemType?: ItemType;

    /**
     * The other items within this directory.
     */
    otherItems: IDirectoryItem[];

    /**
     * This directory item, if renaming item.
     */
    thisItem?: IDirectoryItem;

    /**
     * Callback function that sends up the item name and type. If no arguments
     * are provided, user has cancelled creating new item.
     */
    sendUpCreateItem?: (itemName?: string, itemType?: ItemType) => void;

    /**
     * Callback function that sends up the item's old and new names. If no arguments
     * are provided, user has cancelled renaming item.
     */
    sendUpRenameItem?: (oldName?: string, newName?: string) => void;
}

export default IInputItemProps;
