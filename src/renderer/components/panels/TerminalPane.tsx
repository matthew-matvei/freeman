import autobind from "autobind-decorator";
import log from "electron-log";
import * as React from "react";
import ReactResizeDetector from "react-resize-detector";
import Terminal from "xterm";

import { ISocketMessage } from "models";
import { ITerminalPaneProps } from "props/panels";
import Utils from "Utils";

import "styles/panels/TerminalPane.scss";

/** The component for displaying a terminal frontend. */
class Terminalpane extends React.PureComponent<ITerminalPaneProps> {

    /** The containing div element of the terminal. */
    private container?: HTMLDivElement | null;

    /** The xterm.js terminal frontend. */
    private xterm?: Terminal;

    /**
     * The socket handling communication between the xterm frontend and backend
     * terminal process.
     */
    private socket?: WebSocket;

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
            Utils.trace("Opened socket with terminal service");
            (this.xterm as any).attach(this.socket);
        });
        this.socket.addEventListener("error", event => {
            log.error("Error on terminal socket", event);
        });
    }

    /**
     * Handles closing the socket in the event this component is unmounted.
     */
    public componentWillUnmount() {
        this.socket && this.socket.close();
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
        if (this.socket && this.xterm && this.xterm.fit) {
            this.xterm.fit();
            if (this.socket.readyState === WebSocket.OPEN) {
                Utils.trace("Sending terminal resize request");
                this.socket.send(JSON.stringify({
                    messageType: "resize",
                    payload: { cols: this.xterm.cols, rows: this.xterm.rows }
                } as ISocketMessage));
            }
        }
    }
}

export default Terminalpane;
