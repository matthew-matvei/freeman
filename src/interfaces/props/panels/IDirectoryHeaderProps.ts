import { IColumnProps, IThemeableProps } from "props/common";
import { ColumnType } from "types";

/** Describes properties for the DirectoryHeader component. */
interface IDirectoryHeaderProps extends IColumnProps, IThemeableProps {

    /**
     * Updates the named directory list column's size with the one given (in pixels).
     *
     * @param columnName the name of the column whose size is to be updated
     * @param newSize the size to update the given column to
     */
    updateColumnSize(columnName: ColumnType, newSize: number): void;
}

export default IDirectoryHeaderProps;
