import { DirectoryPaneSide } from "types";

/**
 * Describes the internal state of the App.
 */
interface IAppState {

    /**
     * Which directory pane is currently selected.
     */
    selectedPane: DirectoryPaneSide;
}

export default IAppState;
