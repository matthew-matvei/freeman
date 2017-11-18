import * as React from "react";
import * as PropTypes from "prop-types";
import os from "os";
import path from "path";
import autobind from "autobind-decorator";
import { HotKeys } from "react-hotkeys";
import ScrollArea from "react-scrollbar";

import { DirectoryItem } from "components/blocks";
import { PathPanel } from "components/panels";
import { IAppContext, IDirectoryItem } from "models";
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
     * The items within this directory (files, folders etc.).
     */
    private directoryItems: IDirectoryItem[];

    /**
     * Instantiates the DirectoryPane component.
     *
     * @param props - the properties for the DirectoryPane component
     */
    public constructor(props: IDirectoryPaneProps, context: IAppContext) {
        super(props, context);

        this.state = {
            path: os.homedir(),
            selectedItem: 0,
            showHiddenItems: false
        };

        this.directoryItems = [];
    }

    /**
     * Updates the directory contents prior to loading the component.
     *
     * @param nextprops - the incoming props object
     */
    public componentWillMount() {
        this.directoryItems = DirectoryReader.listDirectory(this.state.path);
    }

    /**
     * Updates the directory contents prior to updating the component.
     *
     * @param nextProps - the incoming props object
     */
    public componentWillUpdate(nextProps: {}, nextState: IDirectoryPaneState) {
        this.directoryItems = DirectoryReader.listDirectory(nextState.path);
    }

    /**
     * Defines how the directory pane component is rendered
     *
     * @returns - a JSX element representing the directory view
     */
    public render(): JSX.Element {
        const items = this.directoryItems
            .filter(item => !item.isHidden || this.state.showHiddenItems)
            .map((item, i) => (
                <DirectoryItem
                    key={item.path}
                    model={item}
                    isSelected={this.props.isSelectedPane && this.state.selectedItem === i}
                    sendPathUp={this.updatePath} />)
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
    private updatePath(path: string) {
        this.setState({ path: path, selectedItem: 0 } as IDirectoryPaneState);
    }

    /**
     * Navigates back to the parent directory.
     */
    @autobind
    private goBack() {
        const parentDirectory = path.join(this.state.path, "..");
        this.updatePath(parentDirectory);
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
            if (this.state.selectedItem < this.directoryItems.length - 1) {
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
}

export default DirectoryPane;
