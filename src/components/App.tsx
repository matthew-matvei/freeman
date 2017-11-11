import * as React from "react";
import SplitPane from "react-split-pane";

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
        return <SplitPane split="vertical">
            <div>Left</div>
            <div>Right</div>
        </SplitPane>;
    }
}

export default App;
