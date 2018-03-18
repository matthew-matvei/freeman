import { IColumnProps } from "props/common";

interface IDirectoryHeaderProps extends IColumnProps {

    updateColumnSizes(nameColumnSize: number, sizeColumnSize: number, lastModifiedSize: number): void;
}

export default IDirectoryHeaderProps;
