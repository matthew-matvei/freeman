import { DirectoryPaneSide } from "types";

/** Describes the internal state of the App. */
interface IAppState {

    /** Which directory pane is currently selected. */
    selectedPane: DirectoryPaneSide;

    /** Whether the command palette is open. */
    isCommandPaletteOpen: boolean;
}

export default IAppState;
