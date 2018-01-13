/** The interface describing a TerminalService. */
interface ITerminalService {

    /** Closes the underlying websocket server. */
    close: () => void;
}

export default ITerminalService;
