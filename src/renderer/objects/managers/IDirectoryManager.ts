import { IDirectoryItem } from "models";
import { ItemType } from "types";

/** The interface describing a DirectoryManager. */
interface IDirectoryManager {

    /**
     * Returns a list of paths of all files in the directory given in path.
     *
     * @param filePath - the path to the directory to list
     * @param sort - a compare function that determines how the items
     *      are sorted
     *
     * @returns - a list of all files in the given directory
     */
    listDirectory(
        filePath: string,
        filterCondition?: (item: IDirectoryItem) => boolean,
        sort?: (unsortedItems: IDirectoryItem[]) => IDirectoryItem[]
    ): Promise<IDirectoryItem[]>;

    /**
     * Creates an item with itemName of itemType at itemPath.
     *
     * @param itemName - the name of the item to be created
     * @param itemPath - the path to the item to be created
     * @param itemType - the type of the item to be created
     */
    createItem(itemName: string, itemPath: string, itemType: ItemType): Promise<void>;

    /**
     * Renames an item with oldName to newName at itemPath.
     *
     * @param oldName - the previous name
     * @param newName - the new name
     * @param itemPath - the path to the item to be renamed
     */
    renameItem(oldName: string, newName: string, itemPath: string): Promise<void>;

    /**
     * Deletes the given itemsToDelete.
     *
     * @param itemsToDelete - an array of all directory items to delete
     */
    deleteItems(itemsToDelete: IDirectoryItem[]): Promise<void>;

    /**
     * Deletes the item of itemType at itemPath.
     *
     * @param itemPath - the full path to the item to be deleted
     * @param itemType - the type of the item to be deleted
     */
    deleteItem(itemPath: string, itemType: ItemType): Promise<void>;

    /**
     * Sends the given itemsToTrash to the system-dependent trash.
     *
     * @param itemsToTrash - the items to send to trash
     */
    sendItemsToTrash(itemsToTrash: IDirectoryItem[]): Promise<void>;

    /**
     * Sends the item at itemPath to the system-dependent trash.
     *
     * @param itemPath - the path to the file
     */
    sendItemToTrash(itemPath: string): Promise<void>;

    /**
     * Copies an item at itemPath to the destinationDirectory.
     *
     * @param itemPath - the full path to the source item
     * @param destinationDirectory - the directory to copy the item to
     */
    copyItem(itemPath: string, destinationDirectory: string): Promise<void>;

    /**
     * Moves an item at itemPath to the destinationDirectory. This involves deleting
     * permanently the source file.
     *
     * @param itemPath - the full path to the source item
     * @param destinationDirectory - the directory to move the item to
     * @param itemType - the type of the source item
     */
    moveItem(itemPath: string, destinationDirectory: string, itemType: ItemType): Promise<void>;
}

export default IDirectoryManager;
