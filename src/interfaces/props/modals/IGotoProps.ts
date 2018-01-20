import { ICloseableProps, IDirectoryManageableProps, IOpenableProps } from "props/common";

/** Describes the properties for the Goto component. */
interface IGotoProps extends ICloseableProps, IOpenableProps, IDirectoryManageableProps {

    /** The initial path the Goto modal is set to. */
    initialPath: string;

    /** A callback function for navigating to the given filePath. */
    navigateTo(filePath: string): void;
}

export default IGotoProps;
