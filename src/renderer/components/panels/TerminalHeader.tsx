import * as React from "react";

import { ITerminalHeaderProps } from "props/panels";

import "styles/panels/TerminalHeader.scss";

/** A header for the integrated terminal. */
class TerminalHeader extends React.PureComponent<ITerminalHeaderProps> {

    /**
     * Defines how the terminal header component is rendered.
     *
     * @returns - a JSX element representing the terminal header view
     */
    public render(): JSX.Element {
        return <div className="TerminalHeader">
            <span>{this.props.shellName}</span>
        </div>;
    }
}

export default TerminalHeader;
