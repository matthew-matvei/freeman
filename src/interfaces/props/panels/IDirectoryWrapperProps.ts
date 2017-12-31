import { IDirectoryCommonProps, IDirectoryManageableProps, IStatusNotifiableProps } from "props/common";

/**
 * Describes the properties of a directory pane component.
 */
interface IDirectoryWrapperProps extends
    IDirectoryCommonProps, IDirectoryManageableProps, IStatusNotifiableProps {

    /** The initial path the directory wrapper is set to. */
    initialPath: string;
}

export default IDirectoryWrapperProps;
