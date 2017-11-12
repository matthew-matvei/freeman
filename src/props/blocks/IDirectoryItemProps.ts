/**
 * Describes a directory item, e.g. a file or folder.
 */
interface IDirectoryItemProps {

    /**
     * The full path to this directory item.
     */
    path: string;

    /**
     * The display name of the directory item.
     */
    name: string;

    /**
     * Whether the item is selected.
     */
    isSelected: boolean;

    /**
     * Whether the item is a directory.
     */
    isDirectory: boolean;

    /**
     * Callback function to send path up to parent.
     */
    sendPathUp: (path: string) => void;
}

export default IDirectoryItemProps;
