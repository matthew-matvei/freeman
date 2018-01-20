import { KeyboardEvent } from "react";

import { ICloseableProps, IOpenableProps } from "props/common";

/** Represents properties for the QuickSelect component. */
interface IQuickSelectProps extends ICloseableProps, IOpenableProps {

    /** The items to select within the quick select component. */
    initialItems: string[];

    /** A callback function invoked when user selects an item. */
    onSelect(selectedItem: string): void;

    /** An optional callback function handling the keyUp event. */
    onKeyUp?(event: KeyboardEvent<HTMLInputElement>): void;

    /** The input value to provide to the search field, if any. */
    inputValue?: string;

    /**
     * An optional callback function invoked when the user updates the quick
     * select.
     */
    onUpdate?(selectedItem: string): void;
}

export default IQuickSelectProps;
