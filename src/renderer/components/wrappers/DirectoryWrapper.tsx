import autobind from "autobind-decorator";
import * as React from "react";
import { HotKeys } from "react-hotkeys";
import ScrollArea from "react-scrollbar/dist/no-css";
import SplitPane from "react-split-pane";

import { DirectoryHeader, DirectoryList, PathPanel } from "components/panels";
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
     * @param propsthe properties for the DirectoryWrapper component
     */
    public constructor(props: IDirectoryWrapperProps) {
        super(props);

        const { settingsManager, initialPath } = this.props;

        try {
            // Try to construct a terminal using shell path given in settings
            this.integratedTerminal = new IntegratedTerminal(settingsManager);
        } catch {
            // Fallback to a pre-defined, system-dependent shell
            const useFallbackShell = true;
            this.integratedTerminal = new IntegratedTerminal(settingsManager, useFallbackShell);
        }

        this.state = {
            isTerminalOpen: settingsManager.settings.terminal.displayAtStartup,
            path: initialPath
        };
    }

    /**
     * Defines how the directory wrapper component is rendered.
     *
     * @returnsa JSX element representing the directory view
     */
    public render(): JSX.Element {
        const scrollAreaVertBarStyle: React.CSSProperties = {
            backgroundColor: "rgb(65, 67, 57)"
        };
        const directoryListHeight = this.state.isTerminalOpen ?
            this.prevScrollAreaHeight || "65vh" : "100%";
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
                        <div className="scrollAreaWrapper">
                            <DirectoryHeader />
                            <div style={{ overflow: "hidden" }}>
                                <ScrollArea
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
                                        theme={this.props.theme} />
                                </ScrollArea>
                            </div>
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
     * @param paththe path to update to
     */
    @autobind
    private updatePath(path: string) {
        this.setState({ path } as IDirectoryWrapperState);
    }
}

export default DirectoryWrapper;
