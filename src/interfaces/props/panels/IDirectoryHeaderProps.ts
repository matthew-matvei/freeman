import { IColumnProps, IThemeableProps } from "props/common";

/** Describes properties for the DirectoryHeader component. */
interface IDirectoryHeaderProps extends IColumnProps, IThemeableProps {

    /**
     * Updates the directory list column sizes with the ones given (in pixels).
     *
     * @param nameColumnSize - the size that the 'name' column should become
     * @param sizeColumnSize - the size that the 'size' column should become
     * @param lastModifiedSize - the size that the 'last modified on' column should become
     */
    updateColumnSizes(nameColumnSize: number, sizeColumnSize: number, lastModifiedSize: number): void;
}

export default IDirectoryHeaderProps;
