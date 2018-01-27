import * as React from "react";

import { IPathPanelProps } from "props/panels";

import "styles/panels/PathPanel.scss";

/**
 * The component for displaying the current path in the directory pane.
 */
class PathPanel extends React.PureComponent<IPathPanelProps> {

    /**
     * Defines how the path pane component is rendered
     *
     * @returns - a JSX element representing the path pane view
     */
    public render(): JSX.Element {
        const { backgroundColour } = this.props.theme.pathPanel;
        const pathPanelStyle = { backgroundColor: backgroundColour };

        return <div style={pathPanelStyle} className="PathPanel">{this.props.path}</div>;
    }
}

export default PathPanel;
