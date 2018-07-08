import { MappedColumnSizes } from "types";

/** Describes column properties of any components that contain columns. */
interface IColumnProps {

    /** Sizes of the columns within the directory list. */
    columnSizes: MappedColumnSizes;
}

export default IColumnProps;
