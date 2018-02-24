import log from "electron-log";
import path from "path";

import LoggedError from "errors/LoggedError";
import { IDirectoryManager, ISettingsManager } from "managers";
import { IDirectoryItem, IListDirectoryOptions, INavigatorDirectoryItem } from "models";
import { INavigator } from "objects";

class Navigator implements INavigator {

    private currentPath!: string;

    private currentDirectoryItems?: INavigatorDirectoryItem[];

    private directoryManager: IDirectoryManager;

    private settingsManager: ISettingsManager;

    private parentDirectoryPath?: string | null;

    private parentDirectoryItems?: INavigatorDirectoryItem[];

    private retrieveOptions: IListDirectoryOptions;

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
            .then(items => this.currentDirectoryItems = items)
            .catch(error => {
                throw new LoggedError(`Could not retrieve directory items for ${this.currentPath}`, error);
            });

        this.retrieveParentDirectoryPath(this.currentPath)
            .then(parentPath => {
                this.parentDirectoryPath = parentPath;
                this.retrieveDirectoryItems().then(items => {
                    this.parentDirectoryItems = items;
                    this.retrieveGrandChildren(this.parentDirectoryItems);
                });
            })
            .catch(error => {
                throw new LoggedError(`Could not determine parent path for ${this.currentPath}`, error);
            });
    }

    public async toParent(): Promise<void> {
        if (this.parentDirectoryPath === null) {
            throw new LoggedError(`Could not navigate to parent from ${this.currentPath}`);
        }

        this.currentPath = this.parentDirectoryPath!;
        this.currentDirectoryItems = this.parentDirectoryItems!;
        this.retrieveGrandChildren(this.currentDirectoryItems);
        this.parentDirectoryPath = await this.retrieveParentDirectoryPath(this.currentPath);
        if (this.parentDirectoryPath !== null) {
            this.parentDirectoryItems = await this.directoryManager
                .listDirectory(this.parentDirectoryPath, this.retrieveOptions);
            this.retrieveGrandChildren(this.parentDirectoryItems);
        }
    }

    public async toChild(folderPath: string): Promise<void> {
        if (!this.currentDirectoryItems) {
            return;
        }

        const childItem = this.currentDirectoryItems.find(item => item.path === folderPath)!;

        if (!childItem.childItems) {
            throw new LoggedError(`Child items for ${childItem.path} have not begun retrieval`);
        }

        const grandChildItems = await childItem.childItems;

        this.parentDirectoryPath = this.currentPath;
        this.currentPath = childItem.path;
        this.parentDirectoryItems = this.currentDirectoryItems;
        this.currentDirectoryItems = grandChildItems;
        this.retrieveGrandChildren(this.currentDirectoryItems);
    }

    public async retrieveDirectoryItems(): Promise<IDirectoryItem[]> {
        if (!this.currentDirectoryItems) {
            const items = await this.directoryManager.listDirectory(this.currentPath, this.retrieveOptions);
            this.currentDirectoryItems = items;
            this.retrieveGrandChildren(this.currentDirectoryItems);
        }

        return this.currentDirectoryItems;
    }

    private retrieveGrandChildren(childItems: INavigatorDirectoryItem[]) {
        childItems.forEach(item => {
            item.isDirectory && this.directoryManager.listDirectory(item.path, this.retrieveOptions)
                .then(grandChildItems =>
                    item.childItems = new Promise<IDirectoryItem[]>(resolve => { resolve(grandChildItems); }))
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
