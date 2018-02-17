/** Describes an integrated, interactive terminal. */
interface IIntegratedTerminal {

    /**
     * Opens the terminal in the container element.
     *
     * @param element - the element in which the terminal is to open
     */
    openIn(element: HTMLDivElement): void;

    /**
     * Fits the terminal to the container element.
     *
     * @param element - the element to which the terminal is fitted
     */
    fitTo(element: HTMLDivElement): void;
}

export default IIntegratedTerminal;
