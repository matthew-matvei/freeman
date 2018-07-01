/** Describes a single directory item (directory, file etc.). */
interface IDirectoryItem {

    /** The full path to this directory item. */
    path: string;

    /** The display name of the directory item. */
    name: string;

    /** Whether the directory item is a directory (i.e., a 'folder'). */
    isDirectory: boolean;

    /** Whether the directory item is hidden. */
    isHidden: boolean;

    /** Whether the directory item can be accessed by the user. */
    accessible: boolean;

    /** The size (in bytes) of the file, if any. */
    size?: number;

    /** The last time the directory item was modified. */
    lastModified: Date;

    /** The date time the directory item was created. */
    created: Date;
}

export default IDirectoryItem;
