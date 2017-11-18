import fs from "fs";
import os from "os";
import path from "path";

import { IDirectoryItem } from "models";
import { DirectorySorter, PlatformHelper } from "objects";

/**
 * Provides static methods for reading files and folders.
 */
class DirectoryReader {

    /**
     * Returns a list of paths of all files in the directory given in path.
     *
     * @param filePath - the path to the directory to list
     * @param sort - a compare function that determines how the items
     *      are sorted
     *
     * @returns - a list of all files in the given directory
     */
    public static listDirectory(
        filePath: string,
        sort: (unsortedItems: IDirectoryItem[]) => IDirectoryItem[] = DirectorySorter.sortByTypeThenAlphaNumery
    ): IDirectoryItem[] {

        if (!(this.isDirectory(filePath))) {
            return [];
        }

        const fileList = fs.readdirSync(filePath);
        const files = fileList.map(fileName => {
            const fullPath = path.join(filePath, fileName);
            const fileStats = fs.lstatSync(fullPath);

            return {
                name: fileName,
                path: fullPath,
                isDirectory: fileStats.isDirectory(),
                isHidden: DirectoryReader.isHidden(fileName)
            } as IDirectoryItem;
        });

        return sort(files);
    }

    /**
     * Returns whether the file at the given path is a directory.
     *
     * @param path - the path to the file
     *
     * @returns - whether the file is a directory
     */
    public static isDirectory(path: string): boolean {
        const fileStats = fs.lstatSync(path);

        return fileStats.isDirectory();
    }

    /**
     * Returns whether the given item (directory, file etc.) is hidden.
     *
     * @param itemName - the name of the item whose visibility is to be determined
     *
     * @returns - whether the given item (directory, file etc.) is hidden
     */
    private static isHidden(itemName: string): boolean {
        const platform = os.platform();
        if (PlatformHelper.isUnix(platform)) {
            if (itemName.startsWith(".")) {
                return true;
            } else {
                return false;
            }
        } else {
            console.warn("isHidden functionality currently available only on Unix-like platforms");
            return false;
        }
    }
}

export default DirectoryReader;
