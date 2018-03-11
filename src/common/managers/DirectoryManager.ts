import log from "electron-log";
import fs from "fs";
import { inject, injectable } from "inversify";
import ncp from "ncp";
import os from "os";
import path from "path";
import trash from "trash";
import { promisify } from "util";

import DirectoryError from "errors/DirectoryError";
import TYPES from "ioc/types";
import { IAttributesManager, IDirectoryManager } from "managers";
import { IDirectoryItem, IListDirectoryOptions } from "models";
import { DirectorySorter } from "objects";
import { ItemType } from "types";
import Utils from "Utils";

const lstatAsync = promisify(fs.lstat);
const rmdirAsync = promisify(fs.rmdir);
const unlinkAsync = promisify(fs.unlink);
const renameAsync = promisify(fs.rename);
const mkdirAsync = promisify(fs.mkdir);
const copyFileAsync = promisify(ncp.ncp);
const writeFileAsync = promisify(fs.writeFile);

/** Provides methods for reading, writing and creating files and folders. */
@injectable()
class DirectoryManager implements IDirectoryManager {

    /** A watcher that observes changes to a directory. */
    private watcher?: fs.FSWatcher;

    private attributesManager: IAttributesManager;

    public constructor(@inject(TYPES.IAttributesManager) attributesManager: IAttributesManager) {
        this.attributesManager = attributesManager;
    }

    /** @inheritDoc */
    public async listDirectory(
        filePath: string,
        options: IListDirectoryOptions
    ): Promise<IDirectoryItem[]> {

        if (!(await DirectoryManager.isDirectory(filePath))) {
            throw new DirectoryError("Cannot call listDirectory on a non-directory item", filePath);
        }

        const filterCondition = options.filterCondition ? options.filterCondition :
            (item: IDirectoryItem) => true;
        const sort = options.sort ? options.sort :
            DirectorySorter.sortByTypeThenAlphaNumery;

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
                isDirectory: fileStats.isDirectory(),
                isHidden: await this.isHidden(fullPath, options.hideUnixStyleHiddenItems),
                name: fileName,
                path: fullPath
            } as IDirectoryItem;
        });

        const files = await Promise.all(filePromises);

        return sort(files).filter(filterCondition);
    }

    /** @inheritDoc */
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
                await writeFileAsync(fullItemName, "");
            } catch {
                throw new DirectoryError("Could not create file", fullItemName);
            }
        }
    }

    /** @inheritDoc */
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

    /** @inheritDoc */
    public async deleteItems(itemsToDelete: IDirectoryItem[]): Promise<void> {
        const itemDeletions = itemsToDelete.map(async item => {
            await DirectoryManager.deleteItem(item.path, Utils.parseItemType(item));
        });

        await Promise.all(itemDeletions);
    }

    /** @inheritDoc */
    public async sendItemsToTrash(itemsToTrash: IDirectoryItem[]): Promise<void> {
        const itemSoftDeletions = itemsToTrash.map(async item => {
            await DirectoryManager.sendItemToTrash(item.path);
        });

        await Promise.all(itemSoftDeletions);
    }

    /** @inheritDoc */
    public async copyItems(itemsToCopy: IDirectoryItem[], destinationDirectory: string): Promise<void> {
        const itemCopies = itemsToCopy.map(async item => {
            await DirectoryManager.copyItem(item.path, destinationDirectory);
        });

        await Promise.all(itemCopies);
    }

    /** @inheritDoc */
    public async moveItems(itemsToMove: IDirectoryItem[], destinationDirectory: string): Promise<void> {
        const itemMoves = itemsToMove.map(async item => {
            await DirectoryManager.moveItem(item.path, destinationDirectory, Utils.parseItemType(item));
        });

        await Promise.all(itemMoves);
    }

    /** @inheritDoc */
    public readFileSync(filePath: string): string {
        return fs.readFileSync(filePath, "utf-8");
    }

    /** @inheritDoc */
    public startWatching(pathToWatch: string, listener: () => void) {
        this.watcher = fs.watch(pathToWatch, listener);
    }

    /** @inheritDoc */
    public stopWatching() {
        this.watcher && this.watcher.close();
    }

    /**
     * Returns whether a given file or folder is hidden.
     *
     * @param pathToItem - the path to the file or folder
     * @param hideUnixStyleHiddenItems - whether Unix-style hidden items should be hidden on Windows
     *
     * @returns whether the file at pathToItem is hidden
     */
    private async isHidden(pathToItem: string, hideUnixStyleHiddenItems: boolean): Promise<boolean> {
        if (!pathToItem) {
            throw new ReferenceError("pathToItem must contain characters");
        }

        const itemName = path.basename(pathToItem);

        if (os.platform() === "linux") {
            return itemName.startsWith(".");
        } else if (os.platform() === "win32") {
            if (hideUnixStyleHiddenItems && itemName.startsWith(".")) {
                return true;
            }

            try {
                const attributes = await this.attributesManager.getAttributesAsync(pathToItem);

                return attributes.hidden;
            } catch (error) {
                log.warn(
                    "Could not determine attributes, defaulting path to not hidden",
                    pathToItem,
                    error);

                return false;
            }
        }

        log.warn("Only linux and win32 platforms currently supported");

        return false;
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
            await copyFileAsync(itemPath, destinationFileName);
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
     * @param pathToItem - the path to the file
     *
     * @returns - whether the file is a directory
     */
    private static async isDirectory(pathToItem: string): Promise<boolean> {
        const stats = await lstatAsync(pathToItem);

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
