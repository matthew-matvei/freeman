import { IDirectoryItem } from "models";

/**
 * A single node in a navigation stack data structure.
 */
interface INavigationNode {

    /** The path to the directory the navigation node refers to. */
    path: string;

    /** The index of the selected item. */
    selectedIndex: number;

    /** A list of all directory items at this level of the stack. */
    directoryItems: IDirectoryItem[];
}

export default INavigationNode;
