import { IDirectoryItem } from "models";

/**
 * Describes a directory item, e.g. a file or folder.
 */
interface IDirectoryItemProps extends IDirectoryItem {

    /**
     * Whether the item is selected.
     */
    isSelected: boolean;

    /**
     * Callback function to send path up to parent.
     */
    sendPathUp: (path: string) => void;
}

export default IDirectoryItemProps;
