import { IIntegratedTerminal } from "objects";
import { ISettingsManageableProps, IThemeableProps } from "props/common";

/** Describes the properties for the TerminalWrapper component. */
interface ITerminalWrapperProps extends ISettingsManageableProps, IThemeableProps {

    /** An integrated terminal instance. */
    integratedTerminal: IIntegratedTerminal;
}

export default ITerminalWrapperProps;
