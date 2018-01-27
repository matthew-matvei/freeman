import {
    IDirectoryCommonProps,
    IDirectoryManageableProps,
    ISettingsManageableProps,
    IStatusNotifiableProps,
    IThemeableProps
} from "props/common";

/** Describes the properties for a DirectoryList component. */
interface IDirectoryListProps extends
    IDirectoryCommonProps,
    IDirectoryManageableProps,
    IStatusNotifiableProps,
    ISettingsManageableProps,
    IThemeableProps {

    /** The path to the directory the pane displays. */
    path: string;

    /** Callback function that handles sending the path up to the parent. */
    sendPathUp(path: string): void;
}

export default IDirectoryListProps;
