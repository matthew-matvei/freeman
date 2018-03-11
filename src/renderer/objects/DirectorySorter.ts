import { IDirectoryItem } from "models";

/**
 * Provides several static methods used for sorting a directory.
 */
export default {

    /**
     * Sorts the directory by type (directory vs. file etc.).
     *
     * @param unsortedItems an array of unsorted directory items
     *
     * @returns the given directory items, sorted by type
     */
    sortByType(unsortedItems: IDirectoryItem[]): IDirectoryItem[] {
        return unsortedItems.sort(compareTypes);
    },

    /**
     * Sorts the directory alphanumerically.
     *
     * @param unsortedItems an array of unsorted directory items
     *
     * @returns the given directory items, sorted alphanumerically
     */
    sortByAlphaNumery(unsortedItems: IDirectoryItem[]): IDirectoryItem[] {
        return unsortedItems.sort((a, b) => a.name.localeCompare(b.name));
    },

    /**
     * Sorts the directory by type, then alphanumerically. This is the default
     * sort function.
     *
     * @param unsortedItems an array of unsorted directory items
     *
     * @returns the given directory items, sorted by type, then alphanumerically
     */
    sortByTypeThenAlphaNumery(unsortedItems: IDirectoryItem[]): IDirectoryItem[] {
        return unsortedItems.sort((a, b) => {
            const typeCompare = compareTypes(a, b);

            return typeCompare !== 0 ? typeCompare : a.name.localeCompare(b.name);
        });
    }

};

/**
 * Compares two directory items based on their type (directory, file etc.).
 *
 * @param a this directory item to compare to
 * @param b that directory item to compare to
 *
 * @returns a number comparing a to b
 */
function compareTypes(a: IDirectoryItem, b: IDirectoryItem): number {
    if (a.isDirectory && !b.isDirectory) {
        return -1;
    } else if (b.isDirectory && !a.isDirectory) {
        return 1;
    } else {
        return 0;
    }
}
