import fs from "fs";
import path from "path";
import trash from "trash";
import ncp from "ncp";
import { injectable } from "inversify";
import { promisify, Promise } from "bluebird";

import { IDirectoryItem } from "models";
import { DirectorySorter } from "objects";
import { ItemType } from "types";
import { IDirectoryManager } from "objects/managers";
import DirectoryError from "errors/DirectoryError";
import Utils from "Utils";

const lstatAsync = promisify(fs.lstat);
const ncpAsync = promisify(ncp.ncp);
const rmdirAsync = promisify(fs.rmdir);
const unlinkAsync = promisify(fs.unlink);
const renameAsync = promisify(fs.rename);
const mkdirAsync = promisify(fs.mkdir);
const writeFileAsync = promisify(fs.writeFile);

/**
 * Provides static methods for reading, writing and creating files and folders.
 */
@injectable()
class DirectoryManager implements IDirectoryManager {

    /**
     * Returns a list of paths of all files in the directory given in path.
     *
     * @param filePath - the path to the directory to list
     * @param filterCondition - a condition with which to filter the items
     * @param sort - a compare function that determines how the items
     *      are sorted
     *
     * @returns - a list of all files in the given directory
     */
    public async listDirectory(
        filePath: string,
        filterCondition: (item: IDirectoryItem) => boolean = (item: IDirectoryItem) => true,
        sort: (unsortedItems: IDirectoryItem[]) => IDirectoryItem[] = DirectorySorter.sortByTypeThenAlphaNumery
    ): Promise<IDirectoryItem[]> {

        if (!(await DirectoryManager.isDirectory(filePath))) {
            throw new DirectoryError("Cannot call listDirectory on a non-directory item", filePath);
        }

        let fileList;

        try {
            fileList = await DirectoryManager.getDirectoryPaths(filePath);
        } catch {
            throw new DirectoryError("Could not list items in directory", filePath);
        }

        const filePromises = fileList.map(async fileName => {
            const fullPath = path.join(filePath, fileName);
            const fileStats = await lstatAsync(fullPath);

            return {
                name: fileName,
                path: fullPath,
                isDirectory: fileStats.isDirectory(),
                isHidden: await Utils.isHidden(fullPath)
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
    public async createItem(itemName: string, itemPath: string, itemType: ItemType): Promise<void> {
        const fullItemName = path.join(itemPath, itemName);

        if (itemType === "folder") {
            try {
                await mkdirAsync(fullItemName);
            } catch {
                throw new DirectoryError("Could not create directory", fullItemName);
            }
        } else {
            try {
                writeFileAsync(fullItemName);
            } catch {
                throw new DirectoryError("Could not create file", fullItemName);
            }
        }
    }

    /**
     * Renames an item with oldName to newName at itemPath.
     *
     * @param oldName - the previous name
     * @param newName - the new name
     * @param itemPath - the path to the item to be renamed
     */
    public async renameItem(oldName: string, newName: string, itemPath: string): Promise<void> {
        if (oldName === newName) {
            return;
        }

        const oldNameFull = path.join(itemPath, oldName);
        const newNameFull = path.join(itemPath, newName);

        try {
            await renameAsync(oldNameFull, newNameFull);
        } catch {
            throw new DirectoryError("Could not rename item", oldNameFull, newNameFull);
        }
    }

    /**
     * Deletes the given itemsToDelete.
     *
     * @param itemsToDelete - an array of all directory items to delete
     */
    public async deleteItems(itemsToDelete: IDirectoryItem[]): Promise<void> {
        const itemDeletions = itemsToDelete.map(async item => {
            await DirectoryManager.deleteItem(item.path, Utils.parseItemType(item));
        });

        await Promise.all(itemDeletions);
    }

    /**
     * Sends the given itemsToTrash to the system-dependent trash.
     *
     * @param itemsToTrash - the items to send to trash
     */
    public async sendItemsToTrash(itemsToTrash: IDirectoryItem[]): Promise<void> {
        const itemSoftDeletions = itemsToTrash.map(async item => {
            await DirectoryManager.sendItemToTrash(item.path);
        });

        await Promise.all(itemSoftDeletions);
    }

    /**
     * Copies the given itemsToCopy to the destinationDirectory.
     *
     * @param itemsToCopy - the items to copy to destinationDirectory
     * @param destinationDirectory - the directory to copy the items to
     */
    public async copyItems(itemsToCopy: IDirectoryItem[], destinationDirectory: string): Promise<void> {
        const itemCopies = itemsToCopy.map(async item => {
            await DirectoryManager.copyItem(item.path, destinationDirectory);
        });

        await Promise.all(itemCopies);
    }

    /**
     * Moves the given itemsToCopy to the destinationDirectory.
     *
     * @param itemsToMove - the items to move to destinationDirectory
     * @param destinationDirectory - the directory to move the items to
     */
    public async moveItems(itemsToMove: IDirectoryItem[], destinationDirectory: string): Promise<void> {
        const itemMoves = itemsToMove.map(async item => {
            await DirectoryManager.moveItem(item.path, destinationDirectory, Utils.parseItemType(item));
        });

        await Promise.all(itemMoves);
    }

    /**
     * Copies an item at itemPath to the destinationDirectory.
     *
     * @param itemPath - the full path to the source item
     * @param destinationDirectory - the directory to copy the item to
     */
    private static async copyItem(itemPath: string, destinationDirectory: string): Promise<void> {
        const fileName = path.basename(itemPath);
        const destinationFileName = path.join(destinationDirectory, fileName);

        try {
            await ncpAsync(itemPath, destinationFileName);
        } catch {
            throw new DirectoryError("Failed to copy item", itemPath, destinationFileName);
        }
    }

    /**
     * Moves an item at itemPath to the destinationDirectory. This involves deleting
     * permanently the source file.
     *
     * @param itemPath - the full path to the source item
     * @param destinationDirectory - the directory to move the item to
     * @param itemType - the type of the source item
     */
    private static async moveItem(itemPath: string, destinationDirectory: string, itemType: ItemType): Promise<void> {
        try {
            await DirectoryManager.copyItem(itemPath, destinationDirectory);
            await DirectoryManager.deleteItem(itemPath, itemType);
        } catch {
            throw new DirectoryError("Failed to copy item", itemPath, destinationDirectory);
        }
    }

    /**
     * Deletes the item of itemType at itemPath.
     *
     * @param itemPath - the full path to the item to be deleted
     * @param itemType - the type of the item to be deleted
     */
    private static async deleteItem(itemPath: string, itemType: ItemType): Promise<void> {
        if (itemType === "folder") {
            try {
                await rmdirAsync(itemPath);
            } catch {
                throw new DirectoryError("Cannot remove folder", itemPath);
            }
        } else {
            try {
                await unlinkAsync(itemPath);
            } catch {
                throw new DirectoryError("Cannot remove file", itemPath);
            }
        }
    }

    /**
     * Sends the item at itemPath to the system-dependent trash.
     *
     * @param itemPath - the path to the file
     */
    private static async sendItemToTrash(itemPath: string): Promise<void> {
        try {
            await trash([itemPath], { glob: false });
        } catch {
            throw new DirectoryError("Could not send item to trash", itemPath);
        }
    }

    /**
     * Returns whether the file at the given path is a directory.
     *
     * @param path - the path to the file
     *
     * @returns - whether the file is a directory
     */
    private static async isDirectory(path: string): Promise<boolean> {
        const stats = await lstatAsync(path);

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
}

export default DirectoryManager;
