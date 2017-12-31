import * as React from "react";
import * as PropTypes from "prop-types";
import fs from "fs";
import path from "path";
import { shell } from "electron";
import { HotKeys } from "react-hotkeys";
import autobind from "autobind-decorator";
import { autoFocus, isAlphanumeric } from "utils";
import { List } from "immutable";
import { remote } from "electron";
const dialog = remote.dialog;

import { DirectoryItem, InputItem } from "components/blocks";
import { IDirectoryItem, IAppContext } from "models";
import { DirectoryListModel } from "objects";
import { IDirectoryListState } from "states/panels";
import { DirectoryDirection, ItemType, ClipboardAction } from "types";
import { IDirectoryListProps } from "props/panels";
import { Goto } from "components/modals";

/** The component for displaying a directory's list of items. */
class DirectoryList extends React.Component<IDirectoryListProps, IDirectoryListState> {

    /** Validation for context types. */
    public static contextTypes = {
        scrollArea: PropTypes.object
    }

    /** Context available within a ScrollArea. */
    public context: { scrollArea: any };

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
        paste: this.pasteFromClipboard,
        chooseItem: this.toggleItemChosen,
        sendToTrash: this.sendToTrash,
        delete: this.delete,
        openGoto: this.openGoto
    }

    /** The internal model of this DirectoryList. */
    private model: DirectoryListModel;

    /** A watcher that monitors activity on the directory list's current directory. */
    private watcher: fs.FSWatcher;

    /**
     * A trapper that can be given focus in cases where focus on directory items
     * is lost.
     */
    private keysTrapper: HotKeys | null;

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
            chosenItems: [],
            selectedIndex: 0,
            showHiddenItems: false,
            creatingNewItem: false,
            renamingItem: false,
            itemDeleted: false,
            isGotoOpen: false,
            isFocused: this.props.isSelectedPane
        }

        this.model = new DirectoryListModel();
    }

    /** Updates the directory contents after loading the component. */
    public async componentDidMount() {
        const { path, directoryManager } = this.props;

        this.watcher = fs.watch(path, async (eventType, filename) => {
            this.setState(
                {
                    directoryItems: await directoryManager.listDirectory(path)
                } as IDirectoryListState);
        });

        const items = await directoryManager.listDirectory(path);

        this.setState({ directoryItems: items } as IDirectoryListState);
    }

    /** Handles closing the watcher on unmounting the directory list. */
    public componentWillUnmount() {
        this.watcher.close();
    }

    public componentWillReceiveProps(nextProps: IDirectoryListProps) {
        if (!this.props.isSelectedPane && nextProps.isSelectedPane) {
            this.setState({ isFocused: true } as IDirectoryListState);
        }
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

        if (prevProps.path !== this.props.path) {
            this.watcher = fs.watch(this.props.path, async (eventType, filename) => {
                this.setState(
                    {
                        directoryItems: await this.props.directoryManager.listDirectory(this.props.path)
                    } as IDirectoryListState);
            });
        }

        const cachedNavigation = this.model.popCachedNavigation(this.props.path);

        if (cachedNavigation) {
            this.setState(
                {
                    directoryItems: cachedNavigation.directoryItems,
                    selectedIndex: cachedNavigation.selectedIndex
                } as IDirectoryListState);
        } else {
            const directoryItems = await this.props.directoryManager.listDirectory(this.props.path);
            const remainingChosenItems = this.state.chosenItems.filter(item => directoryItems.includes(item));
            this.setState(
                {
                    directoryItems: directoryItems,
                    chosenItems: remainingChosenItems
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
        return (this.model.stateChanged(this.state, nextState) ||
            this.model.propsChanged(this.props, nextProps) ||
            this.model.chosenItemsChanged(this.state.chosenItems, nextState.chosenItems) ||
            this.model.directoryItemsChanged(this.state.directoryItems, nextState.directoryItems));
    }

    /**
     * Defines how the directory list component is rendered.
     *
     * @returns - a JSX element representing the directory list view
     */
    public render(): JSX.Element {
        const items = this.nonHiddenDirectoryItems
            .map((item, i) => {
                const isSelectedItem = this.props.isSelectedPane && !this.state.creatingNewItem && this.state.selectedIndex === i;

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
                        isSelected={this.state.isFocused && isSelectedItem}
                        isChosen={this.state.chosenItems.includes(item)}
                        sendPathUp={this.goIn}
                        sendSelectedItemUp={this.selectItem}
                        sendDeletionUp={this.refreshAfterDelete} />;
                }
            });

        return (
            <div>
                <HotKeys
                    handlers={this.handlers}
                    ref={component => {
                        this.keysTrapper = component;
                        this.keysTrapper && items.length === 0 && autoFocus(this.keysTrapper)
                    }}
                    onFocus={this.setFocused}
                    onBlur={this.setUnFocused}>
                    <ul onKeyDown={this.handleKeyDown}>
                        {items}
                        {this.state.creatingNewItem &&
                            <InputItem
                                creatingItemType={this.state.creatingNewItem}
                                sendUpCreateItem={this.createNewItem}
                                otherItems={this.state.directoryItems} />}
                    </ul>
                </HotKeys>
                <Goto
                    initialPath={this.props.path}
                    isOpen={this.state.isGotoOpen}
                    onClose={this.closeGoto}
                    navigateTo={this.navigateToPath}
                    directoryManager={this.props.directoryManager} />
            </div>);
    }

    @autobind
    private closeGoto() {
        if (this.state.isGotoOpen) {
            this.setState({ isGotoOpen: false } as IDirectoryListState);
        }
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
            this.props.directoryManager.createItem(itemName, this.props.path, itemTypeToCreate)
                .then(onfulfilled => {
                    this.setState({ creatingNewItem: false } as IDirectoryListState);
                });
        }
    }

    /**
     * Handles providing a dialog to the user to confirm deletion of an item.
     */
    @autobind
    private delete() {
        const selectedItems = this.state.chosenItems.length > 0 ?
            this.state.chosenItems : [this.nonHiddenDirectoryItems[this.state.selectedIndex]];

        const chosenItems = selectedItems.length > 1 ? "the chosen items" : `'${selectedItems[0].name}'`;
        const confirmDelete = this.confirmationDialog(
            `Are you sure you want to permanently delete ${chosenItems}?`);

        this.keysTrapper && autoFocus(this.keysTrapper);

        if (confirmDelete) {
            this.props.directoryManager.deleteItems(selectedItems)
                .then(onfulfilled => {
                    this.refreshAfterDelete();
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
        this.context.scrollArea.scrollTop();
        const parentDirectory = path.join(this.props.path, "..");
        this.setState({ selectedIndex: 0 } as IDirectoryListState);
        this.props.sendPathUp(parentDirectory);
    }

    /**
     * Updates the path held in the directory pane's state
     *
     * @param path - the path to update to
     */
    @autobind
    private goIn(path: string) {
        this.model.cacheNavigation({
            path: this.props.path,
            selectedIndex: this.state.selectedIndex,
            directoryItems: this.state.directoryItems
        });

        this.setState({ selectedIndex: 0 } as IDirectoryListState);
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
        if (event.key.length === 1 && isAlphanumeric(event.key)) {
            const indexToSelect = this.model.textFinder.addCharAndSearch(
                event.key, this.nonHiddenDirectoryItems);

            if (indexToSelect >= 0) {
                this.setState({ selectedIndex: indexToSelect } as IDirectoryListState);
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
            if (this.state.selectedIndex > 0) {
                this.setState(prevState => ({ selectedIndex: prevState.selectedIndex - 1 } as IDirectoryListState));
            }
        } else {
            if (this.state.selectedIndex < this.nonHiddenDirectoryItems.length - 1) {
                this.setState(prevState => ({ selectedIndex: prevState.selectedIndex + 1 } as IDirectoryListState));
            }
        }
    }

    /**
     * Handles navigating the user to the given path by sending it up to the
     * parent component.
     *
     * @param filePath - the path to navigate to
     */
    @autobind
    private navigateToPath(filePath: string) {
        if (filePath !== this.props.path) {
            this.props.sendPathUp(filePath);
        }
    }

    /** Handles opening the Goto modal window. */
    @autobind
    private openGoto() {
        if (!this.state.isGotoOpen) {
            this.setState({ isGotoOpen: true } as IDirectoryListState);
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
        const { path, directoryManager } = this.props;

        if (this.model.clipboardAction === "copy") {
            directoryManager.copyItem(this.model.clipboardItemPath!, path)
                .then(async onfulfilled => {
                    this.setState(
                        {
                            directoryItems: await directoryManager.listDirectory(path)
                        } as IDirectoryListState);
                });
        } else if (this.model.clipboardAction === "cut") {
            directoryManager.moveItem(this.model.clipboardItemPath!, path)
                .then(async onfulfilled => {
                    this.setState(
                        {
                            directoryItems: await directoryManager.listDirectory(path)
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
            this.props.directoryManager.renameItem(oldName, newName, this.props.path)
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
        this.setState({ selectedIndex: index } as IDirectoryListState);
        this.props.sendSelectedPaneUp(this.props.id);
    }

    /**
     * Handles providing a dialog to the user to confirm sending an item to the
     * trash.
     */
    @autobind
    private sendToTrash() {
        const selectedItems = this.state.chosenItems.length > 0 ?
            this.state.chosenItems : [this.nonHiddenDirectoryItems[this.state.selectedIndex]];

        const chosenItems = selectedItems.length > 1 ? "the chosen items" : `'${selectedItems[0].name}'`;
        const confirmTrash = this.confirmationDialog(
            `Are you sure you want to send ${chosenItems} to the trash?`);

        this.keysTrapper && autoFocus(this.keysTrapper);

        if (confirmTrash) {
            this.props.directoryManager.sendItemsToTrash(selectedItems).then(onfulfilled => {
                this.refreshAfterDelete();
            });
        }
    }

    @autobind
    private setFocused() {
        this.setState({ isFocused: true } as IDirectoryListState);
    }

    @autobind
    private setUnFocused() {
        this.setState({ isFocused: false } as IDirectoryListState);
    }

    /**
     * Stores the currently selected item within the internal clipboard.
     *
     * @param action - the action to take when pasting, "cut" or "copy"
     */
    @autobind
    private storeItemInClipboard(action: ClipboardAction) {
        const selectedItem = this.nonHiddenDirectoryItems[this.state.selectedIndex];

        if (!selectedItem.isDirectory) {
            this.model.itemClipboard = {
                directoryItem: this.nonHiddenDirectoryItems[this.state.selectedIndex],
                clipboardAction: action
            };
        }
    }

    /** Toggles whether the currently selected item is chosen or not. */
    @autobind
    private toggleItemChosen() {
        const selectedItem = this.nonHiddenDirectoryItems[this.state.selectedIndex];

        if (this.state.chosenItems.includes(selectedItem)) {
            this.setState((currentState) => (
                {
                    chosenItems: currentState.chosenItems.filter(item => item.name !== selectedItem.name)
                } as IDirectoryListState))
        } else {
            const chosenItems = List(this.state.chosenItems).withMutations(list => list.push(selectedItem));
            this.setState((currentState) => ({ chosenItems: chosenItems.toArray() } as IDirectoryListState))
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
     * Displays a dialog and returns whether the user confirmed the action described
     * in the given message.
     *
     * @param message - the message to display to the user
     *
     * @returns - whether the user confirmed the described action
     */
    private confirmationDialog(message: string): boolean {
        const confirmIndex = 0;
        const cancelIndex = 1;
        const confirmation = dialog.showMessageBox({
            type: "warning",
            buttons: ["OK", "Cancel"],
            defaultId: cancelIndex,
            cancelId: cancelIndex,
            title: "Confirm deletion",
            message: message
        });

        return confirmation === confirmIndex;
    }
}

export default DirectoryList;
