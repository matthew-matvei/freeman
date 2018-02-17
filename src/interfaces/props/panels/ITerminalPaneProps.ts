import { IIntegratedTerminal } from "objects";
import { IThemeableProps } from "props/common";

/** Describes the properties for the TerminalPane component. */
interface ITerminalPaneProps extends IThemeableProps {

    /** The terminal instance stored in the TerminalWrapper. */
    integratedTerminal: IIntegratedTerminal;
}

export default ITerminalPaneProps;
