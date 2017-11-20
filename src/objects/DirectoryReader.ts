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
    public static async listDirectory(
        filePath: string,
        sort: (unsortedItems: IDirectoryItem[]) => IDirectoryItem[] = DirectorySorter.sortByTypeThenAlphaNumery
    ): Promise<IDirectoryItem[]> {

        if (await !(this.isDirectory(filePath))) {
            return [];
        }

        const fileList = await DirectoryReader.getDirectoryPaths(filePath);
        const filePromises = fileList.map(async fileName => {
            const fullPath = path.join(filePath, fileName);
            const fileStats = await DirectoryReader.getFileStats(fullPath);

            return {
                name: fileName,
                path: fullPath,
                isDirectory: fileStats.isDirectory(),
                isHidden: DirectoryReader.isHidden(fileName)
            } as IDirectoryItem;
        });

        const files = await Promise.all(filePromises);

        return sort(files);
    }

    /**
     * Returns whether the file at the given path is a directory.
     *
     * @param path - the path to the file
     *
     * @returns - whether the file is a directory
     */
    private static async isDirectory(path: string): Promise<boolean> {
        const stats = await DirectoryReader.getFileStats(path);

        return stats.isDirectory();
    }

    /**
     * Returns a list of directory item paths in the given filePath.
     *
     * @param filePath - the path to the directory to get a list of files for
     *
     * @returns - a list of directory item paths in the given filePath
     */
    private static async getDirectoryPaths(filePath: string): Promise<string[]> {
        return new Promise<string[]>((resolve, reject) => {
            fs.readdir(filePath, (error, paths) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(paths);
                }
            });
        });
    }

    /**
     * Returns stats for the file at the given path.
     *
     * @param path - the path to the file whose stats are to be gotten
     *
     * @returns - stats for the file at the given path
     */
    private static async getFileStats(path: string): Promise<fs.Stats> {
        return new Promise<fs.Stats>((resolve, reject) => {
            fs.lstat(path, (error, stats) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(stats);
                }
            });
        });
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
