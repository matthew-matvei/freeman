import { IKeysManager, IThemesManager } from "managers";
import { IIntegratedTerminal } from "objects";
import { IDirectoryManageableProps, IPersistableProps, ISettingsManageableProps } from "props/common";

/** Describes properties for the App component. */
interface IAppProps extends IDirectoryManageableProps, ISettingsManageableProps, IPersistableProps {

    /** A manager that handles key mappings. */
    keysManager: IKeysManager;

    /** A manager that handles the theme. */
    themeManager: IThemesManager;

    leftTerminal: IIntegratedTerminal;

    rightTerminal: IIntegratedTerminal;
}

export default IAppProps;
