import { IColumnSizes } from "models";

/** Describes column properties of any components that contain columns. */
interface IColumnProps {

    /** Sizes of the columns within the directory list. */
    columnSizes: IColumnSizes;
}

export default IColumnProps;
