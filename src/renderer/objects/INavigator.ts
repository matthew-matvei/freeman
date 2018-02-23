import { IDirectoryItem } from "models";

interface INavigator {

    toParent(): void;

    toChild(folderPath: string): Promise<void>;

    retrieveDirectoryItems(): Promise<IDirectoryItem[]>;
}

export default INavigator;
