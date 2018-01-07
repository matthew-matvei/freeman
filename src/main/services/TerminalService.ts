import * as http from "http";
import * as WebSocket from "ws";
import * as pty from "node-pty";
import { ITerminal } from "node-pty/lib/interfaces";

import { ISocketMessage } from "models";
import { isISocketMessage } from "typeGuards";
import Utils from "Utils";

/** Provides access to a terminal backend as a service. */
class TerminalService {

    /** The underlying websocket server for this terminal service. */
    private socketServer: WebSocket.Server;

    /** Initialises an instance of the Terminalservice class. */
    public constructor() {
        const server = http.createServer();
        this.socketServer = new WebSocket.Server({ server: server });
        this.socketServer.on("connection", (webSocket, request) => {
            Utils.trace("Setting up terminal");
            this.setupTerminal(webSocket, request);
        });

        server.listen(8080, () => {
            Utils.trace("Server listening on port 8080");
        });
    }

    /** Closes the underlying websocket server. */
    public close() {
        Utils.trace("Closing socket server");
        this.socketServer.close();
    }

    /**
     * Sets up the terminal backend process associated with the given webSocket.
     *
     * @param webSocket - the socket to connect a new terminal to
     * @param request - the initial request sent to create the connection
     */
    private setupTerminal(webSocket: WebSocket, request: http.IncomingMessage) {
        const { cols, rows } = request.headers;

        Utils.trace("Spawning pty");
        const terminal = pty.spawn(process.platform === "win32" ? "cmd.exe" : "bash", [], {
            name: "xterm-color",
            cols: parseInt(cols as string) || 80,
            rows: parseInt(rows as string) || 24,
            cwd: process.cwd(),
            env: process.env
        });

        terminal.on("data", (data: string) => {
            if (webSocket.readyState === WebSocket.OPEN) {
                webSocket.send(data);
            }
        });

        webSocket.on("message", (message: string) => {
            this.handleMessage(message, terminal);
        });

        webSocket.on("close", () => {
            Utils.trace(`Web socket for terminal ${terminal.pid} closed`);
            terminal.destroy();
        });
    }

    /**
     * Handles an incoming message by interpreting it to the given terminal.
     *
     * @param message - the message received from a TerminalPane, either a simple
     *      char input or an ISocketMessage containing a request
     * @param terminal - the terminal that reacts to incoming messages
     */
    private handleMessage(message: string, terminal: ITerminal): void {
        const parsedMessage = Utils.tryParseJSON(message);

        if (parsedMessage && isISocketMessage(parsedMessage)) {
            const socketMessage = parsedMessage as any as ISocketMessage;
            if (socketMessage.messageType === "resize") {
                Utils.trace("Resizing terminal");
                return terminal.resize(socketMessage.payload.cols, socketMessage.payload.rows)
            }
        }

        return terminal.write(message);
    }
}

export default TerminalService;
