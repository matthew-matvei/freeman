import { IKeysManager, IThemesManager } from "managers";
import { IDirectoryManageableProps, ISettingsManageableProps } from "props/common";

/** Describes properties for the App component. */
interface IAppProps extends IDirectoryManageableProps, ISettingsManageableProps {

    /** A manager that handles key mappings. */
    keysManager: IKeysManager;

    /** A manager that handles the theme. */
    themeManager: IThemesManager;
}

export default IAppProps;
