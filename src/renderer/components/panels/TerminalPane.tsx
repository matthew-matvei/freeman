import autobind from "autobind-decorator";
import * as React from "react";
import ReactResizeDetector from "react-resize-detector";
import { Throttle } from "react-throttle";

import { ITerminalPaneProps } from "props/panels";

import "styles/panels/TerminalPane.scss";

/** The component for displaying a terminal frontend. */
class Terminalpane extends React.PureComponent<ITerminalPaneProps> {

    /** The containing div element of the terminal. */
    private container?: HTMLDivElement | null;

    /**
     * Sets up the xterm frontend and websocket after loading the component.
     */
    public componentDidMount() {
        if (this.container) {
            this.props.integratedTerminal.openIn(this.container);
        }
    }

    /**
     * Defines how the terminal pane component is rendered.
     *
     * @returns - a JSX element representing the terminal view
     */
    public render(): JSX.Element {
        const terminalPaneStyle: React.CSSProperties = {
            background: this.props.theme.terminalPane.backgroundColour
        };

        return <div className="TerminalPane" style={terminalPaneStyle}>
            <div
                className="terminalContainer"
                ref={element => this.container = element}>
                <Throttle time="200" handler="onResize">
                    <ReactResizeDetector handleHeight handleWidth onResize={this.handleResize} />
                </Throttle>
            </div>
        </div>;
    }

    /**
     * Handles re-calling xterm's fit function and sending the next cols and
     * rows numbers to the backend terminal process.
     */
    @autobind
    private handleResize() {
        if (this.container) {
            this.props.integratedTerminal.fitTo(this.container);
        }
    }
}

export default Terminalpane;
