import fs from "fs";
import path from "path";

import { IDirectoryItem, DirectorySorter } from "models";

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
    public static ListDirectory(
        filePath: string,
        sort: (unsortedItems: IDirectoryItem[]) => IDirectoryItem[] = DirectorySorter.SortByTypeThenAlphaNumery
    ): IDirectoryItem[] {

        if (!(this.IsDirectory(filePath))) {
            return [];
        }

        const fileList = fs.readdirSync(filePath);
        const files = fileList.map(fileName => {
            const fullPath = path.join(filePath, fileName);
            const fileStats = fs.lstatSync(fullPath);

            return {
                name: fileName,
                path: fullPath,
                isDirectory: fileStats.isDirectory()
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
    public static IsDirectory(path: string): boolean {
        const fileStats = fs.lstatSync(path);

        return fileStats.isDirectory();
    }
}

export default DirectoryReader;
