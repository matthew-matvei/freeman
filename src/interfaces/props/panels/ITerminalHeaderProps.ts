import { IThemeableProps } from "props/common";

/** Describes properties for the TerminalHeader component. */
interface ITerminalHeaderProps extends IThemeableProps {

    /** The name of the shell used in the integrated terminal. */
    shellName: string;
}

export default ITerminalHeaderProps;
