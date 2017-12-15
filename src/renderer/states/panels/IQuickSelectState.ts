/** The internal state of the QuickSelect component. */
interface IQuickSelectState {

    /** The index of the selected item. */
    selectedIndex: number;

    /** The items from which to choose to display in the quick select. */
    items: string[];
}

export default IQuickSelectState;
