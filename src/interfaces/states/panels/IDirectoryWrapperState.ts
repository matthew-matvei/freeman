import { IColumnSizes } from "models";

/** Describes the internal state of the DirectoryPane. */
interface IDirectoryWrapperState {

    /** The path to the directory the wrapper displays. */
    path: string;

    /** Whether the integrated terminal is open. */
    isTerminalOpen: boolean;

    columnSizes: IColumnSizes;
}

export default IDirectoryWrapperState;
