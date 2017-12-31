import * as React from "react";
import * as PropTypes from "prop-types";
import autobind from "autobind-decorator";
import ScrollArea from "react-scrollbar";
import SplitPane from "react-split-pane";

import { DirectoryList, PathPanel, TerminalPane } from "components/panels";
import { IAppContext } from "models";
import { IDirectoryWrapperState } from "states/panels";
import { IDirectoryWrapperProps } from "props/panels";

import "styles/panels/DirectoryWrapper.scss";

/**
 * The wrapper component for displaying directory content and terminal.
 */
class DirectoryWrapper extends React.Component<IDirectoryWrapperProps, IDirectoryWrapperState> {

    /** Validation for context types. */
    public static contextTypes = {
        theme: PropTypes.object
    }

    /** The global application context. */
    public context: IAppContext;

    /**
     * Instantiates the DirectoryPane component.
     *
     * @param props - the properties for the DirectoryPane component
     */
    public constructor(props: IDirectoryWrapperProps, context: IAppContext) {
        super(props, context);

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
            <PathPanel path={this.state.path} />
            <div className="splitPaneWrapper">
                <SplitPane
                    split="horizontal"
                    defaultSize="65vh"
                    allowResize={false}>
                    <div className="scrollAreaWrapper">
                        <ScrollArea
                            className="directoryScrollArea"
                            horizontal={false}
                            style={{ backgroundColor: this.context.theme.primaryBackgroundColour }}
                            verticalContainerStyle={scrollAreaVertContainerStyle}
                            verticalScrollbarStyle={scrollAreaVertBarStyle}>
                            <DirectoryList
                                id={this.props.id}
                                path={this.state.path}
                                isSelectedPane={this.props.isSelectedPane}
                                sendSelectedPaneUp={this.props.sendSelectedPaneUp}
                                sendPathUp={this.updatePath}
                                directoryManager={this.props.directoryManager}
                                statusNotifier={this.props.statusNotifier} />
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
        this.setState({ path: path } as IDirectoryWrapperState);
    }
}

export default DirectoryWrapper;
