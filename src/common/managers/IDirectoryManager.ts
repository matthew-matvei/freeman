import { IDirectoryItem, IListDirectoryOptions } from "models";
import { ItemType } from "types";

/** The interface describing a DirectoryManager. */
interface IDirectoryManager {

    /**
     * Returns a list of paths of all files in the directory given in path.
     *
     * @param filePath the path to the directory to list
     * @param options an object of options to use when invoking the method
     *
     * @returns a list of all files in the given directory
     */
    listDirectory(
        filePath: string,
        options?: IListDirectoryOptions
    ): Promise<IDirectoryItem[]>;

    /**
     * Creates an item with itemName of itemType at itemPath.
     *
     * @param itemName the name of the item to be created
     * @param itemPath the path to the item to be created
     * @param itemType the type of the item to be created
     */
    createItem(itemName: string, itemPath: string, itemType: ItemType): Promise<void>;

    /**
     * Renames an item with oldName to newName at itemPath.
     *
     * @param oldName the previous name
     * @param newName the new name
     * @param itemPath the path to the item to be renamed
     */
    renameItem(oldName: string, newName: string, itemPath: string): Promise<void>;

    /**
     * Deletes the given itemsToDelete.
     *
     * @param itemsToDelete an array of all directory items to delete
     */
    deleteItems(itemsToDelete: IDirectoryItem[]): Promise<void>;

    /**
     * Sends the given itemsToTrash to the system-dependent trash.
     *
     * @param itemsToTrash the items to send to trash
     */
    sendItemsToTrash(itemsToTrash: IDirectoryItem[]): Promise<void>;

    /**
     * Copies the given itemsToCopy to the destinationDirectory.
     *
     * @param itemsToCopy the items to copy to destinationDirectory
     * @param destinationDirectory the directory to copy the items to
     */
    copyItems(itemsToCopy: IDirectoryItem[], destinationDirectory: string): Promise<void>;

    /**
     * Moves the given itemsToCopy to the destinationDirectory.
     *
     * @param itemsToMove the items to move to destinationDirectory
     * @param destinationDirectory the directory to move the items to
     */
    moveItems(itemsToMove: IDirectoryItem[], destinationDirectory: string): Promise<void>;

    /**
     * Reads the contents of the given file synchronously.
     *
     * @param filePath the path to the file to read
     */
    readFileSync(filePath: string): string;

    /**
     * Starts watching pathToWatch, attaching listener to any change events.
     *
     * @param pathToWatch the path to begin watching
     * @param listener a callback function to invoke when pathToWatch changes
     */
    startWatching(pathToWatch: string, listener: () => void): void;

    /** Stops watching any directory. */
    stopWatching(): void;
}

export default IDirectoryManager;
