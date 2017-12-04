import fs from "fs";
import os from "os";
import path from "path";
import trash from "trash";

import { IDirectoryItem } from "models";
import { DirectorySorter, PlatformHelper } from "objects";
import { ItemType } from "types";

/**
 * Provides static methods for reading, writing and creating files and folders.
 */
class DirectoryManager {

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

        if (await !(DirectoryManager.isDirectory(filePath))) {
            return [];
        }

        const fileList = await DirectoryManager.getDirectoryPaths(filePath);
        const filePromises = fileList.map(async fileName => {
            const fullPath = path.join(filePath, fileName);
            const fileStats = await DirectoryManager.getFileStats(fullPath);

            return {
                name: fileName,
                path: fullPath,
                isDirectory: fileStats.isDirectory(),
                isHidden: DirectoryManager.isHidden(fileName)
            } as IDirectoryItem;
        });

        const files = await Promise.all(filePromises);

        return sort(files);
    }

    /**
     * Creates an item with itemName of itemType at itemPath.
     *
     * @param itemName - the name of the item to be created
     * @param itemPath - the path to the item to be created
     * @param itemType - the type of the item to be created
     */
    public static async createItem(itemName: string, itemPath: string, itemType: ItemType) {
        return new Promise((resolve, reject) => {
            const fullItemName = path.join(itemPath, itemName);
            if (itemType === "folder") {
                fs.mkdir(fullItemName, error => {
                    error && reject(error);

                    resolve();
                });
            } else {
                fs.writeFile(fullItemName, "", error => {
                    error && reject(error);

                    resolve();
                });
            }
        });
    }

    /**
     * Renames an item with oldName to newName at itemPath.
     *
     * @param oldName - the previous name
     * @param newName - the new name
     * @param itemPath - the path to the item to be renamed
     */
    public static async renameItem(oldName: string, newName: string, itemPath: string) {
        return new Promise((resolve, reject) => {
            fs.rename(path.join(itemPath, oldName), path.join(itemPath, newName), error => {
                error && reject(error);

                resolve();
            });
        });
    }

    /**
     * Deletes the item of itemType at itemPath.
     *
     * @param itemPath - the full path to the item to be deleted
     * @param itemType - the type of the item to be deleted
     */
    public static async deleteItem(itemPath: string, itemType: ItemType) {
        return new Promise((resolve, reject) => {
            if (itemType === "folder") {
                fs.rmdir(itemPath, error => {
                    error && reject(error);

                    resolve();
                });
            } else {
                fs.unlink(itemPath, error => {
                    error && reject(error);

                    resolve();
                });
            }
        });
    }

    /**
     * Sends the item at itemPath to the system-dependent trash.
     *
     * @param itemPath - the path to the file
     */
    public static async sendItemToTrash(itemPath: string) {
        await trash([itemPath], { glob: false });
    }

    /**
     * Returns whether the file at the given path is a directory.
     *
     * @param path - the path to the file
     *
     * @returns - whether the file is a directory
     */
    private static async isDirectory(path: string): Promise<boolean> {
        const stats = await DirectoryManager.getFileStats(path);

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

export default DirectoryManager;
