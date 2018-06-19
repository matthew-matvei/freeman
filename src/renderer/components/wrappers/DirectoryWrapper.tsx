import autobind from "autobind-decorator";
import * as React from "react";
import { HotKeys } from "react-hotkeys";
import ScrollArea from "react-scrollbar/dist/no-css";
import SplitPane from "react-split-pane";

import { DirectoryHeader, DirectoryList, PathPanel } from "components/panels";
import { TerminalWrapper } from "components/wrappers";
import { IHandlers } from "models";
import { IDirectoryWrapperProps } from "props/wrappers";
import { IDirectoryWrapperState } from "states/panels";
import Utils from "Utils";

import "styles/wrappers/DirectoryWrapper.scss";

/** The wrapper component for displaying directory content and terminal. */
class DirectoryWrapper extends React.Component<IDirectoryWrapperProps, IDirectoryWrapperState> {

    /** A reference to the directory scroll area in this wrapper. */
    private directoryScrollArea?: HTMLDivElement | null;

    /** The last scroll area height, recorded in 'px'. */
    private prevScrollAreaHeight?: string;

    /** The directory list child of this wrapper. */
    private directoryList?: DirectoryList | null;

    /** Handler functions for the given events this component handles. */
    private handlers: IHandlers = {
        toggleIntegratedTerminal: this.toggleIntegratedTerminal
    };

    /**
     * Instantiates the DirectoryWrapper component.
     *
     * @param props the properties for the DirectoryWrapper component
     */
    public constructor(props: IDirectoryWrapperProps) {
        super(props);

        const { id, persister, settingsManager, initialPath } = this.props;

        const { displayAtStartup } = settingsManager.settings.terminal;

        const isTerminalOpen = displayAtStartup !== undefined ?
            displayAtStartup : persister.get<boolean>(`terminal.${this.props.id}.isOpen`);
        const storedDirectoryScrollAreaHeight = persister.get<string>(`dimensions.directoryScrollArea.${id}`);

        this.state = {
            columnSizes: {
                lastModified: 50,
                name: 50,
                size: 50
            },
            directoryListHeight: isTerminalOpen ?
                storedDirectoryScrollAreaHeight || "65vh" : "100%",
            isTerminalOpen,
            path: initialPath
        };
    }

    /**
     * Defines how the directory wrapper component is rendered.
     *
     * @returns a JSX element representing the directory view
     */
    public render(): JSX.Element {
        const scrollAreaVertBarStyle: React.CSSProperties = {
            backgroundColor: "rgb(65, 67, 57)"
        };
        const directoryListHeight = this.state.isTerminalOpen ?
            this.prevScrollAreaHeight || this.state.directoryListHeight : "100%";
        const resizerStyle: React.CSSProperties = {
            backgroundColor: this.props.theme.resizers.colour,
            display: this.state.isTerminalOpen ? "block" : "none"
        };

        return <HotKeys handlers={this.handlers} className="HotKeys">
            <div className="DirectoryWrapper">
                <PathPanel path={this.state.path} theme={this.props.theme} />
                <div className="splitPaneWrapper">
                    <SplitPane
                        split="horizontal"
                        size={directoryListHeight}
                        resizerStyle={resizerStyle}
                        onDragFinished={this.storeDirectoryListHeight}>
                        <div
                            ref={element => this.directoryScrollArea = element}
                            className="scrollAreaWrapper">
                            <DirectoryHeader
                                columnSizes={this.state.columnSizes}
                                updateColumnSizes={this.updateColumnSizes}
                                theme={this.props.theme} />
                            <div className="clippedHeight">
                                <ScrollArea
                                    className="directoryScrollArea"
                                    horizontal={false}
                                    style={{ backgroundColor: this.props.theme.primaryBackgroundColour }}
                                    verticalScrollbarStyle={scrollAreaVertBarStyle}>
                                    <DirectoryList
                                        ref={directoryList => this.directoryList = directoryList}
                                        id={this.props.id}
                                        path={this.state.path}
                                        isSelectedPane={this.props.isSelectedPane}
                                        sendSelectedPaneUp={this.props.sendSelectedPaneUp}
                                        sendPathUp={this.updatePath}
                                        directoryManager={this.props.directoryManager}
                                        statusNotifier={this.props.statusNotifier}
                                        settingsManager={this.props.settingsManager}
                                        theme={this.props.theme}
                                        columnSizes={this.state.columnSizes} />
                                </ScrollArea>
                            </div>
                        </div>
                        {this.state.isTerminalOpen &&
                            <TerminalWrapper
                                settingsManager={this.props.settingsManager}
                                theme={this.props.theme}
                                integratedTerminal={this.props.integratedTerminal} />}
                    </SplitPane>
                </div>
            </div>
        </HotKeys>;
    }

    /** Stores the last height of the integrated terminal. */
    @autobind
    private storeDirectoryListHeight() {
        if (this.directoryScrollArea) {
            this.prevScrollAreaHeight = `${this.directoryScrollArea.clientHeight}px`;
            this.props.persister.set<string>(`dimensions.directoryScrollArea.${this.props.id}`,
                `${this.directoryScrollArea.clientHeight}px`);
        }
    }

    /** Toggles whether the integrated terminal is displayed. */
    @autobind
    private toggleIntegratedTerminal() {
        this.setState(previousState => {
            if (previousState.isTerminalOpen && this.directoryList && this.directoryList.KeysTrapper) {
                Utils.autoFocus(this.directoryList.KeysTrapper);
            }

            return {
                isTerminalOpen: !previousState.isTerminalOpen
            } as IDirectoryWrapperState;
        });
    }

    /**
     * Updates the column sizes with those given (in pixels).
     *
     * @param nameColumnSize - the size that the 'name' column should be
     * @param sizeColumnSize - the size that the 'size' column should be
     * @param lastModifiedSize - the size that the 'last modified on' column should be
     */
    @autobind
    private updateColumnSizes(nameColumnSize: number, sizeColumnSize: number, lastModifiedSize: number) {
        this.setState({
            columnSizes: {
                lastModified: lastModifiedSize,
                name: nameColumnSize,
                size: sizeColumnSize
            }
        } as IDirectoryWrapperState);
    }

    /**
     * Updates the path held in the directory wrapper's state
     *
     * @param path the path to update to
     */
    @autobind
    private updatePath(path: string) {
        this.setState({ path } as IDirectoryWrapperState);
        this.props.settingsManager.settings.terminal.syncNavigation &&
            this.props.integratedTerminal.changeDirectory(path);
    }
}

export default DirectoryWrapper;
