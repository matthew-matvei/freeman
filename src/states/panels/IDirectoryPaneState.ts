/**
 * Describes the internal state of the DirectoryPane.
 */
interface IDirectoryPaneState {

    /**
     * A list of folders in the current directory.
     */
    folders?: string[];

    /**
     * A list of files in the current directory.
     */
    files?: string[];
}

export default IDirectoryPaneState;
