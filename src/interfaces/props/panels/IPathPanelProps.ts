import { IThemeableProps } from "props/common";

/** Describes the properties of a path panel component. */
interface IPathPanelProps extends IThemeableProps {

    /** The path to display. */
    path: string;
}

export default IPathPanelProps;
