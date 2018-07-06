import { ColumnType } from "types";

interface IColumnHeaderProps {
    columnSize: number;
    columnStyles?: React.CSSProperties;
    heading: string;
    onChange(newSize: number, columnName: ColumnType): void;
}

export default IColumnHeaderProps;
