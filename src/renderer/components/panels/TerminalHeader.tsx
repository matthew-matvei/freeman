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
        const style: React.CSSProperties = {
            background: this.props.theme.terminalHeader.backgroundColour
        };

        return <div className="TerminalHeader" style={style}>
            <span>{this.props.shellName}</span>
        </div>;
    }
}

export default TerminalHeader;
