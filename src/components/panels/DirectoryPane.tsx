import * as React from "react";
import * as PropTypes from "prop-types";
import os from "os";
import path from "path";
import autobind from "autobind-decorator";
import { HotKeys } from "react-hotkeys";
import ScrollArea from "react-scrollbar";

import { DirectoryItem } from "components/blocks";
import { PathPanel } from "components/panels";
import { IAppContext, IDirectoryItem, INavigationNode } from "models";
import { DirectoryReader } from "objects";
import { IDirectoryPaneState } from "states/panels";
import { IDirectoryPaneProps } from "props/panels";
import { DirectoryDirection } from "types";

import "styles/panels/DirectoryPane.scss";

/**
 * The component for displaying directory content.
 */
class DirectoryPane extends React.Component<IDirectoryPaneProps, IDirectoryPaneState> {

    /** Validation for context types. */
    public static contextTypes = {
        theme: PropTypes.object
    }

    /** The global application context. */
    public context: IAppContext;

    /**
     * Handler functions for the given events this component handles.
     */
    private handlers = {
        moveUp: () => this.move("up"),
        moveDown: () => this.move("down"),
        moveBack: this.goBack,
        toggleShowHidden: this.toggleShowHidden
    }

    /**
     * Stores navigation data in a simple stack structure.
     */
    private navigationStack: INavigationNode[];

    /**
     * Instantiates the DirectoryPane component.
     *
     * @param props - the properties for the DirectoryPane component
     */
    public constructor(props: IDirectoryPaneProps, context: IAppContext) {
        super(props, context);

        this.state = {
            path: os.homedir(),
            directoryItems: [],
            selectedItem: 0,
            showHiddenItems: false
        };

        this.navigationStack = [];
    }

    /**
     * Updates the directory contents prior to loading the component.
     */
    public async componentDidMount() {
        const items = await DirectoryReader.listDirectory(this.state.path);

        this.setState({ directoryItems: items } as IDirectoryPaneState);
    }

    /**
     * Updates the directory contents prior to updating the component.
     *
     * @param prevProps - the previous props object
     * @param prevState - the previous state object
     */
    public async componentDidUpdate(prevProps: {}, prevState: IDirectoryPaneState) {
        if (prevState.path === this.state.path) {
            return;
        }

        if (this.navigationStack.length > 0 &&
            this.navigationStack[this.navigationStack.length - 1].path === this.state.path) {

            this.setState(
                {
                    directoryItems: this.navigationStack.pop()!.directoryItems
                } as IDirectoryPaneState);
        } else {
            this.setState(
                {
                    directoryItems: await DirectoryReader.listDirectory(this.state.path)
                } as IDirectoryPaneState);
        }
    }

    /**
     * Defines how the directory pane component is rendered
     *
     * @returns - a JSX element representing the directory view
     */
    public render(): JSX.Element {
        const items = this.state.directoryItems
            .filter(item => !item.isHidden || this.state.showHiddenItems)
            .map((item, i) => (
                <DirectoryItem
                    key={item.path}
                    model={item}
                    isSelected={this.props.isSelectedPane && this.state.selectedItem === i}
                    sendPathUp={this.goIn}
                    sendSelectedItemUp={this.selectItem} />)
            );

        return <ScrollArea
            className="DirectoryPane"
            horizontal={false}
            style={{ backgroundColor: this.context.theme.primaryBackgroundColour }}
            verticalContainerStyle={{ width: "20px" }}
            verticalScrollbarStyle={{ width: "100%" }}>
            <HotKeys handlers={this.handlers}>
                <PathPanel path={this.state.path} />
                <ul>{items}</ul>
            </HotKeys>
        </ScrollArea>;
    }

    /**
     * Updates the path held in the directory pane's state
     *
     * @param path - the path to update to
     */
    @autobind
    private goIn(path: string) {
        const navigationNode: INavigationNode = {
            path: this.state.path,
            selectedItem: this.state.selectedItem,
            directoryItems: this.state.directoryItems
        }
        this.navigationStack.push(navigationNode);
        this.setState({ path: path, selectedItem: 0 } as IDirectoryPaneState);
    }

    /**
     * Navigates back to the parent directory.
     */
    @autobind
    private goBack() {
        const parentDirectory = path.join(this.state.path, "..");
        this.setState({ path: parentDirectory, selectedItem: 0 } as IDirectoryPaneState);
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
                this.setState(prevState => ({ selectedItem: prevState.selectedItem - 1 } as IDirectoryPaneState));
            }
        } else {
            if (this.state.selectedItem < this.state.directoryItems.length - 1) {
                this.setState(prevState => ({ selectedItem: prevState.selectedItem + 1 } as IDirectoryPaneState));
            }
        }
    }

    /**
     * Handles toggling whether hidden files should be shown.
     */
    @autobind
    private toggleShowHidden() {
        this.setState(prevState => (
            {
                showHiddenItems: !prevState.showHiddenItems
            } as IDirectoryPaneState));
    }

    /**
     * Handles selecting the given item in the directory pane.
     *
     * @param itemToSelect - the item to select
     */
    @autobind
    private selectItem(itemToSelect: IDirectoryItem) {
        const index = this.state.directoryItems
            .filter(item => !item.isHidden || this.state.showHiddenItems)
            .findIndex(item => item.name === itemToSelect.name);
        this.setState({ selectedItem: index } as IDirectoryPaneState);
        this.props.sendSelectedPaneUp(this.props.id);
    }
}

export default DirectoryPane;
