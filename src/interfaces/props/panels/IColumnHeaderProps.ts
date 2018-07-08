import { ColumnType } from "types";

/** Describes properties for the ColumnHeader component. */
interface IColumnHeaderProps {

    /** The size, in pixels, of the column. */
    columnSize: number;

    /** The CSS styles of the column. */
    columnStyles?: React.CSSProperties;

    /** The display heading of the column. */
    heading: string;

    /** The type of the column. */
    columnType: ColumnType;

    /**
     * Handles updating the size of the column on a change event.
     *
     * @param newSize the new size of the column received
     * @param columnType the type of the column that's to be updated
     */
    onChange(newSize: number, columnType: ColumnType): void;
}

export default IColumnHeaderProps;
