import { IDirectoryItem, IItemClipboard } from "models";
import { DirectoryTextFinder } from "objects";
import { IDirectoryListProps } from "props/panels";
import { IDirectoryListState } from "states/panels";
import { ClipboardAction } from "types";

/** Provides a model that handles non-view DirectoryList functionality. */
class DirectoryListModel {

    /** An internally compatible clipboard object for copying files. */
    private _itemClipboard: IItemClipboard;

    /** A stack of cached selected indices. */
    private selectedIndexCache: number[];

    /** Finds directory items using simple text matching. */
    private _textFinder: DirectoryTextFinder;

    /**
     * Instantiates a new DirectoryListModel.
     */
    public constructor() {
        this._itemClipboard = {};
        this.selectedIndexCache = [];
        this._textFinder = new DirectoryTextFinder();
    }

    /** Gets the current clipboard action, if any. */
    public get clipboardAction(): ClipboardAction | undefined {
        return this._itemClipboard.clipboardAction;
    }

    /** Gets the current clipboard item, if any. */
    public get clipboardItems(): IDirectoryItem[] | undefined {
        return this._itemClipboard.directoryItems;
    }

    /** Gets the directory text finder. */
    public get textFinder(): DirectoryTextFinder {
        return this._textFinder;
    }

    /** Sets the item clipboard with the given value. */
    public set itemClipboard(value: IItemClipboard) {
        this._itemClipboard = value;
    }

    /**
     * Returns whether anything in the two given states indicates that the state
     * has changed.
     *
     * @param prevState the previous state
     * @param nextState the next state
     *
     * @returns whether the state of the DirectoryList has changed
     */
    public stateChanged(prevState: IDirectoryListState, nextState: IDirectoryListState): boolean {
        return prevState.creatingNewItem !== nextState.creatingNewItem ||
            prevState.itemDeleted !== nextState.itemDeleted ||
            prevState.renamingItem !== nextState.renamingItem ||
            prevState.selectedIndex !== nextState.selectedIndex ||
            prevState.showHiddenItems !== nextState.showHiddenItems ||
            prevState.isGotoOpen !== nextState.isGotoOpen ||
            prevState.isFocused !== nextState.isFocused;
    }

    /**
     * Returns whether anything in the two given props indicates that the props
     * have changed.
     *
     * @param prevProps the previous props
     * @param nextProps the next props
     *
     * @returns whether the props have changed
     */
    public propsChanged(prevProps: IDirectoryListProps, nextProps: IDirectoryListProps): boolean {
        return prevProps.isSelectedPane !== nextProps.isSelectedPane ||
            prevProps.path !== nextProps.path;
    }

    /**
     * Returns whether anything in the two arrays of chosen items indicates that
     * the chosen items have changed.
     *
     * @param prevItems the previously chosen items
     * @param nextItems the next chosen items
     *
     * @returns whether the chosen items have changed
     */
    public chosenItemsChanged(prevItems: IDirectoryItem[], nextItems: IDirectoryItem[]): boolean {
        return prevItems.length !== nextItems.length;
    }

    /**
     * Returns whether anything in the two arrays of directory items indicates that
     * the items have changed.
     *
     * @param prevItems the previous directory items
     * @param nextItems the next directory items
     *
     * @returns whether the directory items have changed
     */
    public directoryItemsChanged(prevItems: IDirectoryItem[], nextItems: IDirectoryItem[]): boolean {
        if (prevItems.length !== nextItems.length) {
            return true;
        }

        for (let i = 0; i < prevItems.length; i++) {
            if (prevItems[i].name !== nextItems[i].name) {
                return true;
            }
        }

        // returns false, avoiding duplicated re-renders during navigation
        return false;
    }

    /**
     * Caches a given selected index value.
     *
     * @param value a selected index to add to the cache
     */
    public cacheSelectedIndex(value: number) {
        this.selectedIndexCache.push(value);
    }

    /** Pops the top selected index off the cache and returns it, if any. */
    public popSelectedIndex(): number | undefined {
        return this.selectedIndexCache.pop();
    }

    /** Clears the selected index cache. */
    public clearSelectedIndexCache() {
        this.selectedIndexCache = [];
    }
}

export default DirectoryListModel;
