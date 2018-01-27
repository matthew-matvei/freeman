import autobind from "autobind-decorator";
import * as React from "react";
import ScrollArea from "react-scrollbar";
import SplitPane from "react-split-pane";

import { DirectoryList, PathPanel, TerminalPane } from "components/panels";
import { IDirectoryWrapperProps } from "props/panels";
import { IDirectoryWrapperState } from "states/panels";

import "styles/panels/DirectoryWrapper.scss";

/**
 * The wrapper component for displaying directory content and terminal.
 */
class DirectoryWrapper extends React.Component<IDirectoryWrapperProps, IDirectoryWrapperState> {

    /**
     * Instantiates the DirectoryPane component.
     *
     * @param props - the properties for the DirectoryPane component
     */
    public constructor(props: IDirectoryWrapperProps) {
        super(props);

        this.state = { path: this.props.initialPath };
    }

    /**
     * Defines how the directory wrapper component is rendered.
     *
     * @returns - a JSX element representing the directory view
     */
    public render(): JSX.Element {
        const scrollAreaVertContainerStyle = { width: "20px" };
        const scrollAreaVertBarStyle = { width: "100%" };

        return <div className="DirectoryWrapper">
            <PathPanel path={this.state.path} theme={this.props.theme} />
            <div className="splitPaneWrapper">
                <SplitPane
                    split="horizontal"
                    defaultSize="65vh"
                    allowResize={false}>
                    <div className="scrollAreaWrapper">
                        <ScrollArea
                            className="directoryScrollArea"
                            horizontal={false}
                            style={{ backgroundColor: this.props.theme.primaryBackgroundColour }}
                            verticalContainerStyle={scrollAreaVertContainerStyle}
                            verticalScrollbarStyle={scrollAreaVertBarStyle}>
                            <DirectoryList
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
                    <div className="terminalPaneWrapper">
                        <TerminalPane />
                    </div>
                </SplitPane>
            </div>
        </div>;
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
