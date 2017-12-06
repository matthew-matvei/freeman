import * as React from "react";
import * as ReactDOM from "react-dom";
import path from "path";
import { shell } from "electron";
import { HotKeys } from "react-hotkeys";
import autobind from "autobind-decorator";

import { DirectoryItem, InputItem } from "components/blocks";
import { IDirectoryItem, IAppContext, IItemClipboard, INavigationNode } from "models";
import { DirectoryManager, DirectoryTextFinder } from "objects";
import { IDirectoryListState } from "states/panels";
import { DirectoryDirection, ItemType, ClipboardAction } from "types";
import { IDirectoryListProps } from "props/panels";

/** The component for displaying a directory's list of items. */
class DirectoryList extends React.Component<IDirectoryListProps, IDirectoryListState> {

    /** Handler functions for the given events this component handles. */
    private handlers = {
        moveUp: () => this.move("up"),
        moveDown: () => this.move("down"),
        moveBack: this.goBack,
        toggleShowHidden: this.toggleShowHidden,
        newFile: () => this.inputNewItem("file"),
        newFolder: () => this.inputNewItem("folder"),
        openInNativeExplorer: this.openInNativeExplorer,
        rename: this.inputRenameItem,
        copy: () => this.storeItemInClipboard("copy"),
        cut: () => this.storeItemInClipboard("cut"),
        paste: this.pasteFromClipboard
    }

    /** Stores navigation data in a simple stack structure. */
    private navigationStack: INavigationNode[];

    /** Finds directory items using simple text matching. */
    private directoryTextFinder: DirectoryTextFinder;

    /** An internally compatible clipboard object for copying files. */
    private itemClipboard: IItemClipboard;

    /** Gets the directory items that are not currently hidden. */
    private get nonHiddenDirectoryItems(): IDirectoryItem[] {
        return this.state.directoryItems.filter(
            item => !item.isHidden || this.state.showHiddenItems);
    }

    /**
     * Instantiates the DirectoryList component.
     *
     * @param props - the properties for the DirectoryList component
     * @param context - the context for the DirectoryList component
     */
    public constructor(props: IDirectoryListProps, context: IAppContext) {
        super(props, context);

        this.state = {
            directoryItems: [],
            selectedItem: 0,
            showHiddenItems: false,
            creatingNewItem: false,
            renamingItem: false,
            itemDeleted: false
        }

        this.navigationStack = [];
        this.itemClipboard = {};
        this.directoryTextFinder = new DirectoryTextFinder();
    }

    /** Updates the directory contents after loading the component. */
    public async componentDidMount() {
        const items = await DirectoryManager.listDirectory(this.props.path);

        this.setState({ directoryItems: items } as IDirectoryListState);
    }

    /**
     * Updates the directory contents after updating the component.
     *
     * @param prevProps - the previous props object
     * @param prevState - the previous state object
     */
    public async componentDidUpdate(prevProps: IDirectoryListProps, prevState: IDirectoryListState) {
        if (prevProps.path === this.props.path &&
            !prevState.creatingNewItem &&
            !prevState.renamingItem &&
            !this.state.itemDeleted) {

            return;
        }

        if (prevState.itemDeleted) {
            this.setState({ itemDeleted: false } as IDirectoryListState);
        }

        if (this.navigationStack.length > 0 &&
            this.navigationStack[this.navigationStack.length - 1].path === this.props.path) {

            const cachedNavigation = this.navigationStack.pop()!;

            this.setState(
                {
                    directoryItems: cachedNavigation.directoryItems,
                    selectedItem: cachedNavigation.selectedItem
                } as IDirectoryListState);
        } else {
            this.setState(
                {
                    directoryItems: await DirectoryManager.listDirectory(this.props.path)
                } as IDirectoryListState);
        }
    }

    /**
     * Whether the component should update.
     *
     * @param nextProps - the next props
     * @param nextState - the next state
     */
    public shouldComponentUpdate(nextProps: IDirectoryListProps, nextState: IDirectoryListState): boolean {
        // various state factors are examined
        if (this.state.creatingNewItem !== nextState.creatingNewItem ||
            this.state.itemDeleted !== nextState.itemDeleted ||
            this.state.renamingItem !== nextState.renamingItem ||
            this.state.selectedItem !== nextState.selectedItem ||
            this.state.showHiddenItems !== nextState.showHiddenItems) {

            return true;
        }

        // various props factors are examined
        if (this.props.isSelectedPane !== nextProps.isSelectedPane ||
            this.props.path !== nextProps.path) {

            return true;
        }

        // directory items are lastly examined
        if (this.state.directoryItems.length !== nextState.directoryItems.length) {
            return true;
        }

        for (let i = 0; i < this.state.directoryItems.length; i++) {
            if (this.state.directoryItems[i].name !== nextState.directoryItems[i].name) {
                return true;
            }
        }

        // returns false, avoiding duplicated re-renders during navigation
        return false;
    }

    /**
     * Defines how the directory list component is rendered.
     *
     * @returns - a JSX element representing the directory list view
     */
    public render(): JSX.Element {
        const items = this.nonHiddenDirectoryItems
            .map((item, i) => {
                const isSelectedItem = this.props.isSelectedPane && !this.state.creatingNewItem && this.state.selectedItem === i;

                if (this.state.renamingItem && isSelectedItem) {
                    const thisItem = this.nonHiddenDirectoryItems.find(i => i.name === item.name);
                    const otherItems = this.state.directoryItems.filter(i => i.name !== item.name);
                    return <InputItem
                        thisItem={thisItem}
                        otherItems={otherItems}
                        sendUpRenameItem={this.renameItem} />;
                } else {
                    return <DirectoryItem
                        key={item.path}
                        model={item}
                        isSelected={isSelectedItem}
                        sendPathUp={this.goIn}
                        sendSelectedItemUp={this.selectItem}
                        sendDeletionUp={this.refreshAfterDelete} />;
                }
            });

        return (
            <HotKeys handlers={this.handlers}
                ref={component => component && items.length === 0 && this.autoFocus(component)}>
                <ul onKeyDown={this.handleKeyDown}>
                    {items}
                    {this.state.creatingNewItem &&
                        <InputItem
                            creatingItemType={this.state.creatingNewItem}
                            sendUpCreateItem={this.createNewItem}
                            otherItems={this.state.directoryItems} />}
                </ul>
            </HotKeys>);
    }

    /**
     * Creates a new directory item if arguments are provided.
     *
     * @param itemName - the name of the item to be created
     * @param itemTypeToCreate - the type of the item to be created
     */
    @autobind
    private createNewItem(itemName?: string, itemTypeToCreate?: ItemType) {
        if (itemName && itemTypeToCreate) {
            DirectoryManager.createItem(itemName, this.props.path, itemTypeToCreate)
                .then(onfulfilled => {
                    this.setState({ creatingNewItem: false } as IDirectoryListState);
                });
        }
    }

    /**
     * Begins the creation of a new directory item.
     *
     * @param itemTypeToCreate - the type of the item to begin creating
     */
    @autobind
    private inputNewItem(itemTypeToCreate: ItemType) {
        this.setState({ creatingNewItem: itemTypeToCreate } as IDirectoryListState);
    }

    /** Begins the renaming of a directory item. */
    @autobind
    private inputRenameItem() {
        this.setState({ renamingItem: true } as IDirectoryListState);
    }

    /** Navigates back to the parent directory. */
    @autobind
    private goBack() {
        const parentDirectory = path.join(this.props.path, "..");
        this.setState({ selectedItem: 0 } as IDirectoryListState);
        this.props.sendPathUp(parentDirectory);
    }

    /**
     * Updates the path held in the directory pane's state
     *
     * @param path - the path to update to
     */
    @autobind
    private goIn(path: string) {
        const navigationNode: INavigationNode = {
            path: this.props.path,
            selectedItem: this.state.selectedItem,
            directoryItems: this.state.directoryItems
        }
        this.navigationStack.push(navigationNode);

        this.setState({ selectedItem: 0 } as IDirectoryListState);
        this.props.sendPathUp(path);
    }

    /**
     * Handles adding single alphanumeric characters to a search term to update
     * the currently-selected item.
     *
     * @param event - an event raised on key down
     */
    @autobind
    private handleKeyDown(event: React.KeyboardEvent<HTMLUListElement>) {
        const regex = new RegExp(/[a-z0-9]/, "i");
        if (event.key.length === 1 && regex.test(event.key)) {
            const indexToSelect = this.directoryTextFinder.addCharAndSearch(
                event.key, this.nonHiddenDirectoryItems);

            if (indexToSelect >= 0) {
                this.setState({ selectedItem: indexToSelect } as IDirectoryListState);
            }
        }
    }

    /**
     * Navigates the currently-selected item in the given direction.
     *
     * @param direction - the direction to navigate in
     */
    @autobind
    private move(direction: DirectoryDirection) {
        if (direction === "up") {
            if (this.state.selectedItem > 0) {
                this.setState(prevState => ({ selectedItem: prevState.selectedItem - 1 } as IDirectoryListState));
            }
        } else {
            if (this.state.selectedItem < this.nonHiddenDirectoryItems.length - 1) {
                this.setState(prevState => ({ selectedItem: prevState.selectedItem + 1 } as IDirectoryListState));
            }
        }
    }

    /**
     * Handles revealing the current directory in the system's native
     * file explorer.
     */
    @autobind
    private openInNativeExplorer() {
        shell.showItemInFolder(this.props.path);
    }

    /**
     * Pastes an item stored in the internal clipboard according to the
     * ClipboardAction previously recorded.
     */
    @autobind
    private async pasteFromClipboard() {
        if (!this.itemClipboard.directoryItem || !this.itemClipboard.clipboardAction) {
            return;
        }

        if (this.state.directoryItems.find(
            item => item.name === this.itemClipboard.directoryItem!.name)) {

            return;
        }

        if (this.itemClipboard.clipboardAction === "copy") {
            DirectoryManager.copyItem(this.itemClipboard.directoryItem.path, this.props.path)
                .then(async onfulfilled => {
                    this.setState(
                        {
                            directoryItems: await DirectoryManager.listDirectory(this.props.path)
                        } as IDirectoryListState);
                });
        } else {
            DirectoryManager.moveItem(this.itemClipboard.directoryItem.path, this.props.path)
                .then(async onfulfilled => {
                    this.setState(
                        {
                            directoryItems: await DirectoryManager.listDirectory(this.props.path)
                        } as IDirectoryListState);
                });
        }
    }

    /** Handles refreshing the page after a delete. */
    @autobind
    private refreshAfterDelete() {
        this.setState({ itemDeleted: true } as IDirectoryListState);
    }

    /**
     * Renames a directory item if arguments are provided.
     *
     * @param oldName - the previous name
     * @param newName - the new name
     */
    @autobind
    private renameItem(oldName?: string, newName?: string) {
        if (oldName && newName) {
            DirectoryManager.renameItem(oldName, newName, this.props.path)
                .then(onfulfilled => {
                    this.setState({ renamingItem: false } as IDirectoryListState);
                });
        }
    }

    /**
     * Handles selecting the given item in the directory pane.
     *
     * @param itemToSelect - the item to select
     */
    @autobind
    private selectItem(itemToSelect: IDirectoryItem) {
        const index = this.nonHiddenDirectoryItems
            .findIndex(item => item.name === itemToSelect.name);
        this.setState({ selectedItem: index } as IDirectoryListState);
        this.props.sendSelectedPaneUp(this.props.id);
    }

    /**
     * Stores the currently selected item within the internal clipboard.
     *
     * @param action - the action to take when pasting, "cut" or "copy"
     */
    @autobind
    private storeItemInClipboard(action: ClipboardAction) {
        const selectedItem = this.nonHiddenDirectoryItems[this.state.selectedItem];

        if (!selectedItem.isDirectory) {
            this.itemClipboard = {
                directoryItem: this.nonHiddenDirectoryItems[this.state.selectedItem],
                clipboardAction: action
            };
        }
    }

    /** Handles toggling whether hidden files should be shown. */
    @autobind
    private toggleShowHidden() {
        this.setState(prevState => (
            {
                showHiddenItems: !prevState.showHiddenItems
            } as IDirectoryListState));
    }

    /**
     * Handles focusing the directory pane if there are no items to display.
     *
     * @param component - the HotKeys wrapper component to call focus on
     */
    private autoFocus(component: HotKeys) {
        (ReactDOM.findDOMNode(component) as HTMLElement).focus();
    }
}

export default DirectoryList;
