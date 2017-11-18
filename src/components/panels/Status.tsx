import * as React from "react";
import * as PropTypes from "prop-types";

import { IStatusProps } from "props/panels";
import { IAppContext } from "models";

import "styles/panels/Status.scss";


/**
 * The status indication component.
 */
class Status extends React.Component<IStatusProps, {}> {

    /** Validation for context types. */
    public static contextTypes = {
        theme: PropTypes.object
    }

    /** The global application context. */
    public context: IAppContext;

    /**
     * Defines how the status indication component is rendered
     *
     * @returns - a JSX element representing the status indication view
     */
    public render(): JSX.Element {
        const { backgroundColour } = this.context.theme.statusBar;
        return <div style={{ backgroundColor: backgroundColour }} className="Status">{this.props.message}</div>;
    }
}

export default Status;
