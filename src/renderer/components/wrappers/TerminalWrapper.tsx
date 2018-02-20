import os from "os";
import path from "path";
import * as React from "react";

import { TerminalHeader, TerminalPane } from "components/panels";
import { ITerminalWrapperProps } from "props/wrappers";

import "styles/wrappers/TerminalWrapper.scss";

/** The wrapper component for displaying all terminal-related components. */
class TerminalWrapper extends React.PureComponent<ITerminalWrapperProps> {

    /**
     * Defines how the terminal wrapper component is rendered.
     *
     * @returns - a JSX element representing the terminal wrapper view
     */
    public render(): JSX.Element | null {
        return <div className="TerminalWrapper">
            <TerminalHeader shellName={this.ShellName} theme={this.props.theme} />
            <TerminalPane theme={this.props.theme} integratedTerminal={this.props.integratedTerminal} />
        </div>;
    }

    /** Gets the name of the shell, as configured in application settings. */
    private get ShellName() {
        const settings = this.props.settingsManager.settings;
        const shellNameFull = os.platform() === "win32" ? settings.windows.shell :
            settings.linux.shell;

        return path.basename(shellNameFull);
    }
}

export default TerminalWrapper;
