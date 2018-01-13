import { ISystemDependentSettings } from "models/settings";

/** Describes Windows-specific settings. */
interface IWindowsSettings extends ISystemDependentSettings {

    /** Whether Unix-style hidden items (those starting with '.') should be hidden. */
    hideUnixStyleHiddenItems: boolean;
}

export default IWindowsSettings;
