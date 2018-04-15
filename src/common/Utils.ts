import log from "electron-log";
import fuzzysearch from "fuzzysearch";
import { List } from "immutable";
import path from "path";
import * as ReactDOM from "react-dom";
import { HotKeys } from "react-hotkeys";

import { IDirectoryItem } from "models";
import { ItemType } from "types";

/** Provides several static helper functions. */
export default {

    /**
     * Handles focusing the appropriate directory item automatically.
     *
     * @param component the HotKeys wrapper component to call focus on
     */
    autoFocus(component: HotKeys | HTMLInputElement) {
        (ReactDOM.findDOMNode(component) as HTMLElement).focus();
    },

    /**
     * Returns all items of type T where pathToFind's basename is fuzzy found in the item's basename,
     * using the translate function to get a string from any object.
     *
     * @param pathToFind the path whose basename is to be found within items
     * @param items an array of paths
     * @param translate a function to translate each given item into a searchable string
     *
     * @returns all items in which pathToFind is fuzzy found
     */
    fuzzySearchItems<T extends Object>(
        pathToFind: string,
        items: T[],
        translate: (item: T) => string = item => item.toString()): T[] {

        const itemsCopy = List(items).toArray();

        if (!pathToFind || pathToFind.endsWith(path.sep)) {
            return itemsCopy;
        }

        return itemsCopy.filter(item => {
            const searchTermSuffix = path.basename(pathToFind.toLocaleLowerCase());
            const itemSuffix = path.basename(translate(item));

            return fuzzysearch(searchTermSuffix, itemSuffix);
        });
    },

    /**
     * Tries to JSON parse a given string. Method returns the object if successful,
     * or false if not.
     *
     * @param JSONString the string to attempt to parse
     *
     * @returns the parsed object if successful, or false if not
     */
    tryParseJSON(JSONString: string): any | false {
        try {
            const obj = JSON.parse(JSONString);

            if (obj && typeof obj === "object") {
                return obj;
            }
        } catch {
            // Silently ignore JSON parsing errors
        }

        return false;
    },

    /**
     * Returns the ItemType of a given directoryItem.
     *
     * @param directoryItem the directory item who's type is to be interpreted
     *
     * @returns the type of the given item
     */
    parseItemType(directoryItem: IDirectoryItem): ItemType {
        return directoryItem.isDirectory ? "folder" : "file";
    },

    /**
     * Logs the given message when process.env.VERBOSE is truthy
     *
     * @param message the verbose message to log
     */
    trace(message: string) {
        process.env.VERBOSE && log.verbose(message);
    }
};
