import { DirectoryPaneSide } from "types";
import { IStatus } from "models";

/** Describes the internal state of the App. */
interface IAppState {

    /** Which directory pane is currently selected. */
    selectedPane: DirectoryPaneSide;

    /** Whether the command palette is open. */
    isCommandPaletteOpen: boolean;

    /** The status to be given to the Status component. */
    status: IStatus;
}

export default IAppState;
