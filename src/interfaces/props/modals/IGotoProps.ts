import {
    ICloseableProps,
    IDirectoryManageableProps,
    IOpenableProps,
    ISettingsManageableProps,
    IThemeableProps
} from "props/common";

/** Describes the properties for the Goto component. */
interface IGotoProps extends
    ICloseableProps,
    IOpenableProps,
    IDirectoryManageableProps,
    ISettingsManageableProps,
    IThemeableProps {

    /** The initial path the Goto modal is set to. */
    initialPath: string;

    /** A callback function for navigating to the given filePath. */
    navigateTo(filePath: string): void;
}

export default IGotoProps;
