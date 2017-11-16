import { DirectoryPaneSide } from 'types';

/**
 * Describes the properties of a directory pane component.
 */
interface IDirectoryPaneProps {

    /**
     * The id of the pane (i.e., "left" or "right").
     */
    id: DirectoryPaneSide;

    /**
     * Whether this pane is currently selected.
     */
    isSelectedPane: boolean;
}

export default IDirectoryPaneProps;
