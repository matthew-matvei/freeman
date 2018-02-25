import { IDirectoryItem } from "models";

interface INavigator {

    toParent(): Promise<void>;

    toChild(folderPath: string): Promise<void>;

    retrieveDirectoryItems(): Promise<IDirectoryItem[]>;

    toDirectory(folderPath: string): Promise<void>;
}

export default INavigator;
