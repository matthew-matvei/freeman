import { IDirectoryItem } from "models";

/**
 * Provides functionality for finding items within a directory based on text
 * user enters.
 */
class DirectoryTextFinder {

    /** The search text to use to find the desired directory item. */
    private searchText: string;

    /** The last time a character was added to the search text. */
    private lastAdditionTime: Date;

    /** Initialises an instance of the DirectoryTextFinder class. */
    public constructor() {
        this.searchText = "";
        this.lastAdditionTime = new Date();
    }

    /**
     * Adds char to the search string and returns the index of the first item that
     * matches the text finder's current search term. Handles clearing expired search
     * terms.
     *
     * @param char - the character to add to the search string
     * @param items - the items to find the search term in
     */
    public addCharAndSearch(char: string, items: IDirectoryItem[]): number {
        const timeout = 500;
        const timeNow = new Date();
        if (timeNow.getTime() - this.lastAdditionTime.getTime() > timeout) {
            this.searchText = "";
        }

        this.searchText += char;
        this.lastAdditionTime = timeNow;

        return items.findIndex(
            item => item.name.toLocaleLowerCase().startsWith(this.searchText.toLocaleLowerCase()));
    }
}

export default DirectoryTextFinder;
