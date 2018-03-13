import { shell } from "electron";
import * as React from "react";
import FaGithub from "react-icons/lib/fa/github";

import { IStatusProps } from "props/panels";

import "styles/panels/Status.scss";

/** The status indication component. */
class Status extends React.PureComponent<IStatusProps> {

    /**
     * Defines how the status indication component is rendered
     *
     * @returnsa JSX element representing the status indication view
     */
    public render(): JSX.Element {
        const { backgroundColour, foregroundColour } = this.props.theme.statusBar;
        const statusBarStyle: React.CSSProperties = { backgroundColor: backgroundColour, color: foregroundColour };
        const githubIconStyle: React.CSSProperties = { verticalAlign: "top" };

        return <div
            style={statusBarStyle}
            className="Status">
            <div className="leftGroup">
                <span>{this.props.message}</span>
            </div>
            <div className="rightGroup">
                <span>{`${this.props.itemCount} items`}</span>
                <span>{`${this.props.chosenCount} chosen`}</span>
                <span><FaGithub style={githubIconStyle} color={foregroundColour} onClick={openGithub} /></span>
            </div>
        </div>;
    }
}

/** Handles opening the Github page for this project in the user's browser. */
function openGithub() {
    shell.openExternal("https://github.com/matthew-matvei/freeman");
}

export default Status;
