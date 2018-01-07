import * as ReactDOM from "react-dom";
import os from "os";
import path from "path";
import log from "electron-log";
import { HotKeys } from "react-hotkeys";
import fuzzysearch from "fuzzysearch";
import winattr, {Attributes} from "winattr";

import { IDirectoryItem } from "models";
import { ItemType } from "types";
import DirectoryError from 'errors/DirectoryError';

class Utils {

    /**
     * Handles focusing the appropriate directory item automatically.
     *
     * @param component - the HotKeys wrapper component to call focus on
     */
    public static autoFocus = (component: HotKeys | HTMLInputElement) => {
        (ReactDOM.findDOMNode(component) as HTMLElement).focus();
    }

    /**
     * Returns whether all characters in a given string are alphanumeric.
     *
     * @param letters - a string to test for alphanumeracy
     *
     * @returns - whether all letters are alphanumeric
     */
    public static isAlphanumeric = (letters: string): boolean => {
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
    public static fuzzySearchItems = (pathToFind: string, items: string[]): string[] => {
        if (!pathToFind || pathToFind.endsWith(path.sep)) {
            return items;
        }

        return items.filter(item => {
            const searchTermSuffix = path.basename(pathToFind.toLocaleLowerCase());
            const itemSuffix = path.basename(item.toLocaleLowerCase());

            return fuzzysearch(searchTermSuffix, itemSuffix);
        })
    }

    /**
     * Tries to JSON parse a given string. Method returns the object if successful,
     * or false if not.
     *
     * @param JSONString - the string to attempt to parse
     *
     * @returns - the parsed object if successful, or false if not
     */
    public static tryParseJSON = (JSONString: string): any | false => {
        try {
            const obj = JSON.parse(JSONString);

            if (obj && typeof obj === "object") {
                return obj;
            }
        } catch {
            // Silently ignore JSON parsing errors
        }

        return false;
    }

    /**
     * Returns the ItemType of a given directoryItem.
     *
     * @param directoryItem - the directory item who's type is to be interpreted
     *
     * @returns - the type of the given item
     */
    public static parseItemType = (directoryItem: IDirectoryItem): ItemType => {
        return directoryItem.isDirectory ? "folder" : "file";
    }

    /**
     * Logs the given message when process.env.VERBOSE is truthy
     *
     * @param message - the verbose message to log
     */
    public static trace = (message: string) => {
        process.env.VERBOSE && log.verbose(message);
    }

    /**
     * Returns whether a given file or folder is hidden.
     * 
     * @param pathToItem - the path to the file or folder
     * 
     * @returns whether the file at pathToItem is hidden
     */
    public static isHidden = async (pathToItem: string): Promise<boolean> => {
        const itemName = path.basename(pathToItem);
        if (os.platform() === "linux") {
            return itemName.startsWith(".");
        } else if (os.platform() === "win32") {
            try {
                const attributes = await Utils.getAsync(pathToItem);
                return attributes.hidden;
            } catch {
                throw new DirectoryError("Could not determine attributes", pathToItem);
            }
        }

        log.warn("Only linux and win32 platforms currently supported");

        return false;
    }

    /**
     * Returns a promisified version of the winattr.get function.
     * 
     * @param path - the path to a file or folder
     */
    public static getAsync = (path: string): Promise<Attributes> => {
        return new Promise<Attributes>((resolve, reject) => {
            winattr.get(path, (err, attrs) => {
                err && reject(err);

                resolve(attrs);
            });
        });
    }
}

export default Utils;