import * as React from "react";

import { IStatusProps } from "props/panels";

import "styles/panels/Status.scss";

/** The status indication component. */
class Status extends React.PureComponent<IStatusProps> {

    /**
     * Defines how the status indication component is rendered
     *
     * @returns - a JSX element representing the status indication view
     */
    public render(): JSX.Element {
        const { backgroundColour } = this.props.theme.statusBar;
        const statusBarStyle = { backgroundColor: backgroundColour };

        return <div
            style={statusBarStyle}
            className="Status">
            <div className="leftGroup">
                <span>{this.props.message}</span>
            </div>
            <div className="rightGroup">
                <span>{`${this.props.itemCount} items`}</span>
                <span>{`${this.props.chosenCount} chosen`}</span>
            </div>
        </div>;
    }
}

export default Status;
