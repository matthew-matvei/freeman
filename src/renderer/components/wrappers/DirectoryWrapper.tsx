import autobind from "autobind-decorator";
import * as React from "react";
import { HotKeys } from "react-hotkeys";
import ScrollArea from "react-scrollbar";
import SplitPane from "react-split-pane";

import { DirectoryList, PathPanel } from "components/panels";
import { TerminalWrapper } from "components/wrappers";
import { IHandlers } from "models";
import { IIntegratedTerminal, IntegratedTerminal } from "objects";
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

    /** The terminal frontend. */
    private integratedTerminal: IIntegratedTerminal;

    /** Handler functions for the given events this component handles. */
    private handlers: IHandlers = {
        toggleIntegratedTerminal: this.toggleIntegratedTerminal
    };

    /**
     * Instantiates the DirectoryWrapper component.
     *
     * @param props - the properties for the DirectoryWrapper component
     */
    public constructor(props: IDirectoryWrapperProps) {
        super(props);

        const { settingsManager, initialPath } = this.props;

        this.integratedTerminal = new IntegratedTerminal(settingsManager);

        this.state = {
            path: initialPath,
            isTerminalOpen: settingsManager.settings.terminal.displayAtStartup
        };
    }

    /**
     * Defines how the directory wrapper component is rendered.
     *
     * @returns - a JSX element representing the directory view
     */
    public render(): JSX.Element {
        const scrollAreaVertContainerStyle = { width: "20px" };
        const scrollAreaVertBarStyle = { width: "100%" };
        const directoryListHeight = this.state.isTerminalOpen ?
            this.prevScrollAreaHeight || "65vh" : "100%";
        const resizerStyle: React.CSSProperties = {
            display: this.state.isTerminalOpen ? "block" : "none"
        };

        return <HotKeys
            handlers={this.handlers}>
            <div className="DirectoryWrapper">
                <PathPanel path={this.state.path} theme={this.props.theme} />
                <div className="splitPaneWrapper">
                    <SplitPane
                        split="horizontal"
                        size={directoryListHeight}
                        resizerStyle={resizerStyle}
                        onDragFinished={this.storeDirectoryListHeight}>
                        <div
                            className="scrollAreaWrapper"
                            ref={element => this.directoryScrollArea = element}>
                            <ScrollArea
                                className="directoryScrollArea"
                                horizontal={false}
                                style={{ backgroundColor: this.props.theme.primaryBackgroundColour }}
                                verticalContainerStyle={scrollAreaVertContainerStyle}
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
                                    theme={this.props.theme} />
                            </ScrollArea>
                        </div>
                        {this.state.isTerminalOpen &&
                            <TerminalWrapper
                                settingsManager={this.props.settingsManager}
                                theme={this.props.theme}
                                integratedTerminal={this.integratedTerminal} />}
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
     * Updates the path held in the directory wrapper's state
     *
     * @param path - the path to update to
     */
    @autobind
    private updatePath(path: string) {
        this.setState({ path } as IDirectoryWrapperState);
    }
}

export default DirectoryWrapper;
