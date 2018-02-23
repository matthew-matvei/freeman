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
            .then(parentPath => this.parentDirectoryPath = parentPath)
            .catch(error => {
                throw new LoggedError(`Could not determine parent path for ${this.currentPath}`, error);
            });
    }

    public toParent(): void {
        throw new Error("Method not implemented.");
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
                    item.childItems = new Promise<IDirectoryItem[]>(resolve => { resolve(grandChildItems); }));
        });
    }

    private async retrieveParentDirectoryPath(basePath: string): Promise<string | null> {
        const possibleParentPath = path.dirname(basePath);

        return await this.directoryManager.exists(possibleParentPath) ?
            possibleParentPath : null;
    }
}

export default Navigator;
