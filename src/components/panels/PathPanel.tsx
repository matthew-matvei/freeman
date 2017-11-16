import * as React from "react";

import { IPathPanelProps } from "props/panels";

/**
 * The component for displaying the current path in the directory pane.
 */
class PathPanel extends React.Component<IPathPanelProps, {}> {

    /**
     * Defines how the path pane component is rendered
     *
     * @returns - a JSX element representing the path pane view
     */
    public render(): JSX.Element {
        return <div>{this.props.path}</div>;
    }
}

export default PathPanel;
