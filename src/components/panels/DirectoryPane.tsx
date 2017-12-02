import * as React from "react";
import * as PropTypes from "prop-types";
import os from "os";
import autobind from "autobind-decorator";
import ScrollArea from "react-scrollbar";
import SplitPane from "react-split-pane";

import { DirectoryList, PathPanel, TerminalPane } from "components/panels";
import { IAppContext } from "models";
import { IDirectoryPaneState } from "states/panels";
import { IDirectoryPaneProps } from "props/panels";

import "styles/panels/DirectoryPane.scss";

/**
 * The wrapper component for displaying directory content and terminal.
 */
class DirectoryWrapper extends React.Component<IDirectoryPaneProps, IDirectoryPaneState> {

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
    public constructor(props: IDirectoryPaneProps, context: IAppContext) {
        super(props, context);

        this.state = { path: os.homedir() };
    }

    /**
     * Defines how the directory wrapper component is rendered.
     *
     * @returns - a JSX element representing the directory view
     */
    public render(): JSX.Element {
        const wrappingDivStyle = { width: "100%" };
        const scrollAreaVertContainerStyle = { width: "20px" };
        const scrollAreaVertBarStyle = { width: "100%" };
        return <div className="DirectoryPane">
            <SplitPane
                split="horizontal"
                defaultSize="65vh"
                allowResize={false}>
                <div style={wrappingDivStyle}>
                    <PathPanel path={this.state.path} />
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
                            sendPathUp={this.updatePath} />
                    </ScrollArea>
                </div>
                <ScrollArea
                    className="terminalScrollArea"
                    horizontal={false}
                    style={{ backgroundColor: this.context.theme.primaryBackgroundColour }}
                    verticalContainerStyle={scrollAreaVertContainerStyle}
                    verticalScrollbarStyle={scrollAreaVertBarStyle}>
                    <TerminalPane />
                </ScrollArea>
            </SplitPane>
        </div>;
    }

    /**
     * Updates the path held in the directory wrapper's state
     *
     * @param path - the path to update to
     */
    @autobind
    private updatePath(path: string) {
        this.setState({ path: path, selectedItem: 0 } as IDirectoryPaneState);
    }
}

export default DirectoryWrapper;
