import * as React from "react";
import SplitPane from "react-split-pane";

import { Status } from "components/panels";

import "styles/App.scss";

/**
 * The main application component.
 */
class App extends React.Component<{}, {}> {

    /**
     * Defines how the main application component is rendered
     *
     * @returns - a JSX element representing the main application view
     */
    public render(): JSX.Element {
        return <div className="App">
            <SplitPane split="vertical" style={{ height: "95vh" }}>
                <div>Left</div>
                <div>Right</div>
            </SplitPane>
            <Status />
        </div>;
    }
}

export default App;
