import log from "electron-log";
import path from "path";

import LoggedError from "errors/LoggedError";
import { IDirectoryManager, ISettingsManager } from "managers";
import { IDirectoryItem, IListDirectoryOptions, INavigatorDirectoryItem } from "models";
import { INavigator } from "objects";

/** Handles navigating the file system. */
class Navigator implements INavigator {

    /** The current path. */
    private currentPath: string;

    /** The directory items at the current path. */
    private currentDirectoryItems?: INavigatorDirectoryItem[];

    /** A manager to handle directory operations. */
    private directoryManager: IDirectoryManager;

    /** A manager to handle application settings. */
    private settingsManager: ISettingsManager;

    /** The parent directory path, or null if one cannot be accessed. */
    private parentDirectoryPath?: Promise<string | null>;

    /** The parent directory's items, which exist only if parentDirectoryPath is not null. */
    private parentDirectoryItems?: Promise<INavigatorDirectoryItem[]>;

    /** Options to use with the directory manager's listDirectory method. */
    private retrieveOptions: IListDirectoryOptions;

    /**
     * Initialises a new instance of the Navigator class.
     *
     * @param initialPath - the initial path the navigator is set to
     * @param directoryManager - a manager to handle directory operations
     * @param settingsManager - a manager to handle application settings
     */
    public constructor(
        initialPath: string,
        directoryManager: IDirectoryManager,
        settingsManager: ISettingsManager) {

        this.directoryManager = directoryManager;
        this.settingsManager = settingsManager;
        this.retrieveOptions = {
            hideUnixStyleHiddenItems: this.settingsManager.settings.windows.hideUnixStyleHiddenItems
        };

        this.currentPath = initialPath;

        this.retrieveDirectoryItems()
            .then(items => {
                this.retrieveGrandChildren(items);
                this.currentDirectoryItems = items;
            })
            .catch(error => {
                throw new LoggedError(`Could not retrieve directory items for ${this.currentPath}`, error);
            });

        this.retrieveParentDirectoryPath(this.currentPath)
            .then(parentPath => {
                this.parentDirectoryPath = Promise.resolve(parentPath);
                parentPath && this.directoryManager.listDirectory(parentPath, this.retrieveOptions)
                    .then(async items => {
                        this.parentDirectoryItems = Promise.resolve(items);
                        this.retrieveGrandChildren(await this.parentDirectoryItems);
                    });
            })
            .catch(error => {
                throw new LoggedError(`Could not determine parent path for ${this.currentPath}`, error);
            });
    }

    /** @inheritDoc */
    public async toParent(): Promise<void> {
        if (await this.parentDirectoryPath === null) {
            throw new LoggedError(`Could not navigate to parent from ${this.currentPath}`);
        }

        this.currentPath = await this.parentDirectoryPath! as string;
        this.currentDirectoryItems = await this.parentDirectoryItems!;
        this.retrieveGrandChildren(this.currentDirectoryItems);

        return this.retrieveParentDirectoryPath(this.currentPath)
            .then(parentPath => {
                this.parentDirectoryPath = Promise.resolve(parentPath);
                parentPath && this.directoryManager.listDirectory(parentPath, this.retrieveOptions)
                    .then(async items => {
                        this.parentDirectoryItems = Promise.resolve(items);
                        this.retrieveGrandChildren(await this.parentDirectoryItems);
                    });
            });
    }

    /** @inheritDoc */
    public async toChild(folderPath: string): Promise<void> {
        if (!this.currentDirectoryItems) {
            return;
        }

        const childItem = this.currentDirectoryItems.find(item => item.path === folderPath)!;

        if (!childItem.childItems) {
            throw new LoggedError(`Child items for ${childItem.path} have not begun retrieval`);
        }

        const grandChildItems = await childItem.childItems;

        this.parentDirectoryPath = Promise.resolve(this.currentPath);
        this.currentPath = childItem.path;
        this.parentDirectoryItems = Promise.resolve(this.currentDirectoryItems);
        this.currentDirectoryItems = grandChildItems;
        this.retrieveGrandChildren(this.currentDirectoryItems);
    }

    /** @inheritDoc */
    public async toDirectory(folderPath: string): Promise<void> {
        if (folderPath === await this.parentDirectoryPath) {
            return this.toParent();
        }

        const potentialChild = this.currentDirectoryItems &&
            this.currentDirectoryItems.find(item => item.path === folderPath);

        if (potentialChild) {
            return this.toChild(potentialChild.path);
        }

        this.currentPath = folderPath;
        this.currentDirectoryItems = await this.directoryManager.listDirectory(folderPath, this.retrieveOptions);
        this.retrieveGrandChildren(this.currentDirectoryItems);

        return this.retrieveParentDirectoryPath(this.currentPath)
            .then(parentPath => {
                this.parentDirectoryPath = Promise.resolve(parentPath);
                parentPath && this.directoryManager.listDirectory(parentPath, this.retrieveOptions)
                    .then(async items => {
                        this.parentDirectoryItems = Promise.resolve(items);
                        this.retrieveGrandChildren(await this.parentDirectoryItems);
                    });
            })
            .catch(error => {
                throw new LoggedError(`Could not determine parent path for ${this.currentPath}`, error);
            });
    }

    /** @inheritDoc */
    public async retrieveDirectoryItems(): Promise<IDirectoryItem[]> {
        if (!this.currentDirectoryItems) {
            const items = await this.directoryManager.listDirectory(this.currentPath, this.retrieveOptions);
            this.currentDirectoryItems = items;
            this.retrieveGrandChildren(this.currentDirectoryItems);
        }

        return this.currentDirectoryItems;
    }

    private retrieveGrandChildren(childItems: INavigatorDirectoryItem[]) {
        childItems.forEach(async item => {
            return item.isDirectory && this.directoryManager.listDirectory(item.path, this.retrieveOptions)
                .then(async grandChildItems =>
                    item.childItems = Promise.resolve(grandChildItems))
                .catch(error => log.warn(`Could not retrieve grand children for ${item.path}`));
        });
    }

    private async retrieveParentDirectoryPath(basePath: string): Promise<string | null> {
        const possibleParentPath = path.dirname(basePath);

        return await this.directoryManager.exists(possibleParentPath) ?
            possibleParentPath : null;
    }
}

export default Navigator;
