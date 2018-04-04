/** Describes an integrated, interactive terminal. */
interface IIntegratedTerminal {

    /** The shell used in this integrated terminal. */
    readonly shell: string;

    /**
     * Opens the terminal in the container element.
     *
     * @param element the element in which the terminal is to open
     */
    openIn(element: HTMLDivElement): void;

    /**
     * Fits the terminal to the container element.
     *
     * @param element the element to which the terminal is fitted
     */
    fitTo(element: HTMLDivElement): void;

    /**
     * Sends a command to change to pathToDirectory.
     *
     * @param pathToDirectory - the path of the directory to change to
     */
    changeDirectory(pathToDirectory: string): void;
}

export default IIntegratedTerminal;
