/** Describes the internal state of the DirectoryPane. */
interface IDirectoryWrapperState {

    /** The path to the directory the wrapper displays. */
    path: string;

    /** Whether the integrated terminal is open. */
    isTerminalOpen: boolean;
}

export default IDirectoryWrapperState;
