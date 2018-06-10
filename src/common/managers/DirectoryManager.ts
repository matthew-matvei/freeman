import log from "electron-log";
import fs from "fs";
import { inject, injectable } from "inversify";
import os from "os";
import path from "path";
import trash from "trash";

import DirectoryError from "errors/DirectoryError";
import TYPES from "ioc/types";
import { IAttributesManager, IDirectoryManager } from "managers";
import { IDirectoryItem, IListDirectoryOptions } from "models";
import { DirectorySorter } from "objects";
import { ItemType } from "types";
import Utils from "Utils";
import { IFileSystemWrapper } from "wrappers";

/** Provides methods for reading, writing and creating files and folders. */
@injectable()
class DirectoryManager implements IDirectoryManager {

    /** A watcher that observes changes to a directory. */
    private watcher?: fs.FSWatcher;

    /** A wrapper that abstracts file system operations. */
    private fileSystemWrapper: IFileSystemWrapper;

    /** A manager that handles directory item attributes on Windows. */
    private attributesManager: IAttributesManager;

    /**
     * Initialises a new instance of the DirectoryManager class.
     *
     * @param fileSystemWrapper - a wrapper that abstracts file system operations
     * @param attributesManager - a manager that handles directory item attributes on Windows
     */
    public constructor(
        @inject(TYPES.IFileSystemWrapper) fileSystemWrapper: IFileSystemWrapper,
        @inject(TYPES.IAttributesManager) attributesManager: IAttributesManager
    ) {
        this.fileSystemWrapper = fileSystemWrapper;
        this.attributesManager = attributesManager;
    }

    /** @inheritDoc */
    public async listDirectory(
        filePath: string,
        options: IListDirectoryOptions
    ): Promise<IDirectoryItem[]> {

        if (!(await this.isDirectory(filePath))) {
            throw new DirectoryError("Cannot call listDirectory on a non-directory item", filePath);
        }

        const filterCondition = options.filterCondition ? options.filterCondition :
            (item: IDirectoryItem) => true;
        const sort = options.sort ? options.sort :
            DirectorySorter.sortByTypeThenAlphaNumery;

        let fileList;

        try {
            fileList = await this.fileSystemWrapper.readdirAsync(filePath);
        } catch {
            throw new DirectoryError("Could not list items in directory", filePath);
        }

        const files = await Promise.all(fileList.map(async fileName => {
            const fullPath = path.join(filePath, fileName);
            let fileStats: fs.Stats;

            try {
                fileStats = await this.fileSystemWrapper.lstatAsync(fullPath);
            } catch {
                return {
                    accessible: false,
                    isDirectory: true,
                    isHidden: await this.isHidden(fullPath, options.hideUnixStyleHiddenItems),
                    name: fileName,
                    path: fullPath
                } as IDirectoryItem;
            }

            return {
                accessible: await this.isAccessible(fullPath),
                isDirectory: fileStats.isDirectory(),
                isHidden: await this.isHidden(fullPath, options.hideUnixStyleHiddenItems),
                lastModified: fileStats.mtime,
                name: fileName,
                path: fullPath,
                size: !fileStats.isDirectory() && fileStats.size || undefined
            } as IDirectoryItem;
        }));

        return sort(files).filter(filterCondition);
    }

    /** @inheritDoc */
    public async createItem(itemName: string, itemPath: string, itemType: ItemType): Promise<void> {
        const fullItemName = path.join(itemPath, itemName);

        if (itemType === "folder") {
            try {
                await this.fileSystemWrapper.mkdirAsync(fullItemName);
            } catch {
                throw new DirectoryError("Could not create directory", fullItemName);
            }
        } else {
            try {
                await this.fileSystemWrapper.writeFileAsync(fullItemName, "");
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
            await this.fileSystemWrapper.renameAsync(oldNameFull, newNameFull);
        } catch {
            throw new DirectoryError("Could not rename item", oldNameFull, newNameFull);
        }
    }

    /** @inheritDoc */
    public async deleteItems(itemsToDelete: IDirectoryItem[]): Promise<void> {
        const itemDeletions = itemsToDelete.map(async item => {
            await this.deleteItem(item.path, Utils.parseItemType(item));
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
            await this.copyItem(item.path, destinationDirectory);
        });

        await Promise.all(itemCopies);
    }

    /** @inheritDoc */
    public async moveItems(itemsToMove: IDirectoryItem[], destinationDirectory: string): Promise<void> {
        const itemMoves = itemsToMove.map(async item => {
            await this.moveItem(item.path, destinationDirectory, Utils.parseItemType(item));
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
     * @param pathToItem the path to the file or folder
     * @param hideUnixStyleHiddenItems whether Unix-style hidden items should be hidden on Windows
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
            return this.handleWindowsIshidden(pathToItem, hideUnixStyleHiddenItems);
        }

        log.warn("Only linux and win32 platforms currently supported");

        return false;
    }

    /**
     * Handles returning whether a given file or folder is hidden on Windows.
     *
     * @param pathToItem the path to the file or folder
     * @param hideUnixStyleHiddenItems whether Unix-style hidden items should be hidden on Windows
     *
     * @returns whether the file at pathToItem is hidden
     */
    private async handleWindowsIshidden(pathToItem: string, hideUnixStyleHiddenItems: boolean): Promise<boolean> {
        const itemName = path.basename(pathToItem);

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

    /**
     * Returns whether the user has at least read access to the directory at pathToItem.
     *
     * @param pathToItem the path to test accessibility
     *
     * @returns whether the user has at least read access to the directory at pathToItem
     */
    private async isAccessible(pathToItem: string): Promise<boolean> {
        try {
            await this.fileSystemWrapper.accessAsync(pathToItem, fs.constants.R_OK);

            return true;
        } catch {
            return false;
        }
    }

    /**
     * Copies an item at itemPath to the destinationDirectory.
     *
     * @param itemPath the full path to the source item
     * @param destinationDirectory the directory to copy the item to
     */
    private async copyItem(itemPath: string, destinationDirectory: string): Promise<void> {
        const fileName = path.basename(itemPath);
        const destinationFileName = path.join(destinationDirectory, fileName);

        try {
            await this.fileSystemWrapper.copyAsync(itemPath, destinationFileName);
        } catch {
            throw new DirectoryError("Failed to copy item", itemPath, destinationFileName);
        }
    }

    /**
     * Moves an item at itemPath to the destinationDirectory. This involves deleting
     * permanently the source file.
     *
     * @param itemPath the full path to the source item
     * @param destinationDirectory the directory to move the item to
     * @param itemType the type of the source item
     */
    private async moveItem(itemPath: string, destinationDirectory: string, itemType: ItemType): Promise<void> {
        try {
            await this.copyItem(itemPath, destinationDirectory);
            await this.deleteItem(itemPath, itemType);
        } catch {
            throw new DirectoryError("Failed to copy item", itemPath, destinationDirectory);
        }
    }

    /**
     * Deletes the item of itemType at itemPath.
     *
     * @param itemPath the full path to the item to be deleted
     * @param itemType the type of the item to be deleted
     */
    private async deleteItem(itemPath: string, itemType: ItemType): Promise<void> {
        if (itemType === "folder") {
            try {
                await this.fileSystemWrapper.rmdirAsync(itemPath);
            } catch {
                throw new DirectoryError("Cannot remove folder", itemPath);
            }
        } else {
            try {
                await this.fileSystemWrapper.unlinkAsync(itemPath);
            } catch {
                throw new DirectoryError("Cannot remove file", itemPath);
            }
        }
    }

    /**
     * Returns whether the file at the given path is a directory.
     *
     * @param pathToItem the path to the file
     *
     * @returns whether the file is a directory
     */
    private async isDirectory(pathToItem: string): Promise<boolean> {
        const stats = await this.fileSystemWrapper.lstatAsync(pathToItem);

        return stats.isDirectory();
    }

    /**
     * Sends the item at itemPath to the system-dependent trash.
     *
     * @param itemPath the path to the file
     */
    private static async sendItemToTrash(itemPath: string): Promise<void> {
        try {
            await trash([itemPath], { glob: false });
        } catch {
            throw new DirectoryError("Could not send item to trash", itemPath);
        }
    }
}

export default DirectoryManager;
