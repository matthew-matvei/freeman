import { ColumnType } from "types";

interface IColumnHeaderProps {
    columnSize: number;
    columnStyles?: React.CSSProperties;
    heading: string;
    columnType: ColumnType;
    onChange(newSize: number, columnType: ColumnType): void;
}

export default IColumnHeaderProps;
