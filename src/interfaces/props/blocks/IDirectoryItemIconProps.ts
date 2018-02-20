import { IDirectoryItem } from "models";
import { IThemeableProps } from "props/common";
import { ItemType } from "types";

/** Describes the properties for the DirectoryItem component. */
interface IDirectoryItemIconProps extends IThemeableProps {

    /** The directory item the icon is for, if any. */
    directoryItem?: IDirectoryItem;

    /** The type of directory item being created, if any. */
    directoryItemType?: ItemType;
}

export default IDirectoryItemIconProps;
