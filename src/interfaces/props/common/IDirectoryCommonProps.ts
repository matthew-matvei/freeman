import { DirectoryPaneSide } from "types";

/** Describes the common properties for directory components. */
interface IDirectoryCommonProps {

    /** The id of the pane (i.e., "left" or "right"). */
    id: DirectoryPaneSide;

    /** Whether this pane is currently selected. */
    isSelectedPane: boolean;

    /** Callback function to send selected pane up to parent. */
    sendSelectedPaneUp(paneToSelect: DirectoryPaneSide): void;
}

export default IDirectoryCommonProps;
