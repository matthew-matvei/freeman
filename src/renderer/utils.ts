import * as ReactDOM from "react-dom";
import path from "path";
import { HotKeys } from "react-hotkeys";
import fuzzysearch from "fuzzysearch";

/**
 * Handles focusing the appropriate directory item automatically.
 *
 * @param component - the HotKeys wrapper component to call focus on
 */
export const autoFocus = (component: HotKeys | HTMLInputElement) => {
    (ReactDOM.findDOMNode(component) as HTMLElement).focus();
}

/**
 * Returns whether all characters in a given string are alphanumeric.
 *
 * @param letters - a string to test for alphanumeracy
 *
 * @returns - whether all letters are alphanumeric
 */
export const isAlphanumeric = (letters: string): boolean => {
    const regex = new RegExp(/[a-z0-9]/, "i");
    return regex.test(letters);
}

/**
 * Returns all items where pathToFind's basename is fuzzy found in the item's basename.
 *
 * @param pathToFind - the path whose basename is to be found within items
 * @param items - an array of paths
 *
 * @returns - all items in which pathToFind is fuzzy found
 */
export const fuzzySearchItems = (pathToFind: string, items: string[]): string[] => {
    if (!pathToFind || pathToFind.endsWith(path.sep)) {
        return items;
    }

    return items.filter(item => {
        const searchTermSuffix = path.basename(pathToFind.toLocaleLowerCase());
        const itemSuffix = path.basename(item.toLocaleLowerCase());

        return fuzzysearch(searchTermSuffix, itemSuffix);
    })
}
