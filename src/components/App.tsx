import * as React from "react";
import SplitPane from "react-split-pane";

class App extends React.Component<{}, {}> {
    public render(): JSX.Element {
        return <SplitPane split="vertical">
            <div>Left</div>
            <div>Right</div>
        </SplitPane>;
    }
}

export default App;
