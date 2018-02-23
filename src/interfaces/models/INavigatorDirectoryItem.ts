import { IDirectoryItem } from "models";

interface INavigatorDirectoryItem extends IDirectoryItem {
    childItems?: Promise<IDirectoryItem[]>;
}

export default INavigatorDirectoryItem;
