import { IDirectoryCommonProps } from "props/common";

/**
 * Describes the properties of a directory pane component.
 */
interface IDirectoryWrapperProps extends IDirectoryCommonProps {

    /** The initial path the directory wrapper is set to. */
    initialPath: string;
}

export default IDirectoryWrapperProps;
