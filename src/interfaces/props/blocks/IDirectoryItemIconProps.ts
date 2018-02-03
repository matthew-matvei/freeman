import { IDirectoryItem } from "models";
import { IThemeableProps } from "props/common";

/** Describes the properties for the DirectoryItem component. */
interface IDirectoryItemIconProps extends IThemeableProps {

    /** The directory item the icon is for. */
    directoryItem: IDirectoryItem;
}

export default IDirectoryItemIconProps;
