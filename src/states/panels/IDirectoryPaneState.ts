import { IDirectoryItem } from 'models';

/**
 * Describes the internal state of the DirectoryPane.
 */
interface IDirectoryPaneState {

    /**
     * The path to the directory the pane displays.
     */
    path: string;

    /**
     * The items within this directory (files, folders etc.).
     */
    directoryItems: IDirectoryItem[];

    /**
     * The index of the currently selected item.
     */
    selectedItem: number;

    /**
     * Whether the directory pane should show hidden items.
     */
    showHiddenItems: boolean;
}

export default IDirectoryPaneState;
