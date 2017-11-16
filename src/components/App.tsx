import * as React from "react";
import SplitPane from "react-split-pane";
import { HotKeys } from "react-hotkeys";
import autobind from "autobind-decorator";

import { DirectoryPane, Status } from "components/panels";
import keyMap from "keys";

import { IAppState } from "states";

import "styles/App.scss";

/**
 * The main application component.
 */
class App extends React.Component<{}, IAppState> {

    /**
     * Handler functions for the given events this component handles.
     */
    private handlers = {
        switchPane: this.switchPane
    }

    /**
     * Defines how the main app component is rendered.
     *
     * @returns - a JSX element representing the app view
     */
    constructor(props: {}) {
        super(props);

        this.state = {
            selectedPane: "left"
        }
    }

    /**
     * Defines how the main application component is rendered
     *
     * @returns - a JSX element representing the main application view
     */
    public render(): JSX.Element {
        return <HotKeys keyMap={keyMap} handlers={this.handlers}>
            <div className="App">
                <SplitPane
                    split="vertical"
                    defaultSize="50vw"
                    style={{ height: "95vh" }}
                    paneStyle={{ overflowY: "auto" }}>
                    <DirectoryPane
                        id="left"
                        isSelectedPane={this.state.selectedPane === "left"} />
                    <DirectoryPane
                        id="right"
                        isSelectedPane={this.state.selectedPane === "right"} />
                </SplitPane>
                <Status />
            </div>
        </HotKeys>;
    }

    /**
     * Handles switching selected pane.
     */
    @autobind
    private switchPane() {
        const { selectedPane } = this.state;

        if (selectedPane === "left") {
            this.setState({ selectedPane: "right" } as IAppState);
        } else {
            this.setState({ selectedPane: "left" } as IAppState)
        }
    }
}

export default App;
