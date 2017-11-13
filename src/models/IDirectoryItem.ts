interface IDirectoryItem {

    /**
     * The full path to this directory item.
     */
    path: string;

    /**
     * The display name of the directory item.
     */
    name: string;

    /**
     * Whether the directory item is a directory.
     */
    isDirectory: boolean;
}

export default IDirectoryItem;
