import fs from "fs";
import path from "path";
import trash from "trash";
import hidefile from "hidefile";
import ncp from "ncp";

import { IDirectoryItem } from "models";
import { DirectorySorter } from "objects";
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
        filterCondition: (item: IDirectoryItem) => boolean = (item: IDirectoryItem) => true,
        sort: (unsortedItems: IDirectoryItem[]) => IDirectoryItem[] = DirectorySorter.sortByTypeThenAlphaNumery
    ): Promise<IDirectoryItem[]> {

        if (!(await DirectoryManager.isDirectory(filePath))) {
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
                isHidden: await DirectoryManager.isHiddenAsync(fullPath)
            } as IDirectoryItem;
        });

        const files = await Promise.all(filePromises);

        return sort(files).filter(filterCondition);
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
            oldName === newName && resolve();

            fs.rename(path.join(itemPath, oldName), path.join(itemPath, newName), error => {
                error && reject(error);

                resolve();
            });
        });
    }

    /**
     * Deletes the given itemsToDelete.
     *
     * @param itemsToDelete - an array of all directory items to delete
     */
    public static async deleteItems(itemsToDelete: IDirectoryItem[]) {
        const itemDeletions = itemsToDelete.map(async item => {
            await DirectoryManager.deleteItem(item.path, item.isDirectory ? "folder" : "file");
        });

        await Promise.all(itemDeletions);
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
     * Sends the given itemsToTrash to the system-dependent trash.
     *
     * @param itemsToTrash - the items to send to trash
     */
    public static async sendItemsToTrash(itemsToTrash: IDirectoryItem[]) {
        const itemSoftDeletions = itemsToTrash.map(async item => {
            await DirectoryManager.sendItemToTrash(item.path);
        });

        await Promise.all(itemSoftDeletions);
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
     * Copies an item at itemPath to the destinationDirectory.
     *
     * @param itemPath - the full path to the source item
     * @param destinationDirectory - the directory to copy the item to
     */
    public static async copyItem(itemPath: string, destinationDirectory: string) {
        return new Promise((resolve, reject) => {
            const fileName = path.basename(itemPath);
            ncp.ncp(itemPath, path.join(destinationDirectory, fileName), error => {
                error && reject(error);

                resolve();
            });
        });
    }

    /**
     * Moves an item at itemPath to the destinationDirectory. This involves deleting
     * permanently the source file.
     *
     * @param itemPath - the full path to the source item
     * @param destinationDirectory - the directory to move the item to
     */
    public static async moveItem(itemPath: string, destinationDirectory: string) {
        await DirectoryManager.copyItem(itemPath, destinationDirectory)
            .catch(onrejected => {
                console.error("Failed to copy item", onrejected);
            }).then(onfulfilled => {
                DirectoryManager.deleteItem(itemPath, "file");
            });
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
     * @param itemPath - the path to the item whose visibility is to be determined
     *
     * @returns - whether the given item (directory, file etc.) is hidden
     */
    private static async isHiddenAsync(itemPath: string): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            hidefile.isHidden(itemPath, (err, result) => {
                err && reject(err);

                resolve(result);
            });
        });
    }
}

export default DirectoryManager;
