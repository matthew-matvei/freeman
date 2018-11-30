import { IIntegratedTerminal } from "objects";
import {
    IDirectoryCommonProps,
    IDirectoryManageableProps,
    IPersistableProps,
    ISettingsManageableProps,
    IStatusNotifiableProps,
    IThemeableProps
} from "props/common";

/** Describes the properties of a directory pane component. */
interface IDirectoryWrapperProps extends
    IDirectoryCommonProps,
    IDirectoryManageableProps,
    IStatusNotifiableProps,
    ISettingsManageableProps,
    IThemeableProps,
    IPersistableProps {

    integratedTerminal: IIntegratedTerminal;
}

export default IDirectoryWrapperProps;
