import { ICloseableProps, IOpenableProps } from "props/common";

/** Represents properties for the QuickSelect component. */
interface IQuickSelectProps extends ICloseableProps, IOpenableProps {

    /** The items to select within the quick select component. */
    items: string[];

    /** A callback function invoked when user selects an item. */
    onSelect: (selectedItem: string) => void;
}

export default IQuickSelectProps;
