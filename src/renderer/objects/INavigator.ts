import { IDirectoryItem } from "models";

/** Describes a Navigator. */
interface INavigator {

    /** Navigates to the parent directory. */
    toParent(): Promise<void>;

    /**
     * Navigates to the direct child folderPath of the current directory.
     *
     * @param folderPath - the child folder path to navigate to
     */
    toChild(folderPath: string): Promise<void>;

    /** Retrieves the current directory items. */
    retrieveDirectoryItems(): Promise<IDirectoryItem[]>;

    /**
     * Navigates to any folderPath.
     *
     * @param folderPath - the folder path to navigate to
     */
    toDirectory(folderPath: string): Promise<void>;

    /**
     * Adds itemToAdd to the current cache of directory items.
     *
     * @param itemToAdd - the item to add to the cache of directory items
     */
    addToCache(itemToAdd: IDirectoryItem): void;

    /**
     * Removes itemsToRemove from the current cache of directory items.
     *
     * @param itemsToRemove - the items to remove from the cache of directory items
     */
    removeFromCache(itemsToRemove: IDirectoryItem[]): void;
}

export default INavigator;
