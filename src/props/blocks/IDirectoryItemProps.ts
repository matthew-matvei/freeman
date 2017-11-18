import { IDirectoryItem } from "models";

/**
 * Describes the properties of a directory item component.
 */
interface IDirectoryItemProps {

    /**
     * The underlying model for a DirectoryItem component.
     */
    model: IDirectoryItem;

    /**
     * Whether the item is selected.
     */
    isSelected: boolean;

    /**
     * Callback function to send path up to parent.
     */
    sendPathUp: (path: string) => void;

    /**
     * Callback function to send selected item up to parent.
     */
    sendSelectedItemUp: (itemToSelect: IDirectoryItem) => void;
}

export default IDirectoryItemProps;
