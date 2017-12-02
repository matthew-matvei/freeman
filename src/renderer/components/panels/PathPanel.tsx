import * as React from "react";
import * as PropTypes from "prop-types";

import { IPathPanelProps } from "props/panels";
import { IAppContext } from "models";

import "styles/panels/PathPanel.scss";

/**
 * The component for displaying the current path in the directory pane.
 */
class PathPanel extends React.PureComponent<IPathPanelProps> {

    /** Validation for context types. */
    public static contextTypes = {
        theme: PropTypes.object
    }

    /** The global application context. */
    public context: IAppContext;

    /**
     * Defines how the path pane component is rendered
     *
     * @returns - a JSX element representing the path pane view
     */
    public render(): JSX.Element {
        const { backgroundColour } = this.context.theme.pathPanel;
        const pathPanelStyle = { backgroundColor: backgroundColour };

        return <div style={pathPanelStyle} className="PathPanel">{this.props.path}</div>;
    }
}

export default PathPanel;
