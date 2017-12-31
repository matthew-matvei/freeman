import * as React from "react";
import Terminal from "xterm";
import autobind from "autobind-decorator";
import ReactResizeDetector from "react-resize-detector";

import { ISocketMessage } from "models";

import "styles/panels/TerminalPane.scss";

/** The component for displaying a terminal frontend. */
class Terminalpane extends React.PureComponent {

    /** The containing div element of the terminal. */
    private container: HTMLDivElement | null;

    /** The xterm.js terminal frontend. */
    private xterm: Terminal;

    /**
     * The socket handling communication between the xterm frontend and backend
     * terminal process.
     */
    private socket: WebSocket;

    /**
     * Sets up the xterm frontend and websocket after loading the component.
     */
    public componentDidMount() {
        (Terminal as any).loadAddon("fit");
        (Terminal as any).loadAddon("attach");
        this.xterm = new Terminal();
        this.container && this.xterm.open(this.container, true);
        this.xterm.fit!();

        this.socket = new WebSocket("ws://127.0.0.1:8080");
        this.socket.addEventListener("open", event => {
            (this.xterm as any).attach(this.socket);
        });
    }

    /**
     * Handles closing the socket in the event this component is unmounted.
     */
    public componentWillUnmount() {
        this.socket.close();
    }

    /** Whether the component should update. */
    public shouldComponentUpdate() {
        // returns false, since the terminal DOM container should only render once
        return false;
    }

    /**
     * Defines how the terminal pane component is rendered.
     *
     * @returns - a JSX element representing the terminal view
     */
    public render(): JSX.Element {
        return <div className="TerminalPane">
            <div
                className="terminalContainer"
                ref={element => this.container = element}>
                <ReactResizeDetector handleHeight onResize={this.handleResize} />
            </div>
        </div>;
    }

    /**
     * Handles re-calling xterm's fit function and sending the next cols and
     * rows numbers to the backend terminal process.
     */
    @autobind
    private handleResize() {
        if (this.xterm && this.xterm.fit) {
            this.xterm.fit();
            this.socket.send(JSON.stringify({
                messageType: "resize",
                payload: { cols: this.xterm.cols, rows: this.xterm.rows }
            } as ISocketMessage));
        }
    }
}

export default Terminalpane;
