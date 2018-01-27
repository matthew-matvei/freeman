import { ISettingsManager } from "managers";

/** Describes properties for components capable of managing settings. */
interface ISettingsManageableProps {

    /** A manager that can handle application settings. */
    settingsManager: ISettingsManager;
}

export default ISettingsManageableProps;
