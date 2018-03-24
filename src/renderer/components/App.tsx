import autobind from "autobind-decorator";
import os from "os";
import * as React from "react";
import { HotKeys } from "react-hotkeys";
import SplitPane from "react-split-pane";

import { CommandPalette } from "components/modals";
import { Status } from "components/panels";
import { DirectoryWrapper } from "components/wrappers";
import { IHandlers, IStatusNotifier } from "models";
import { ApplicationCommander, IIntegratedTerminal, IntegratedTerminal } from "objects";
import { IAppProps } from "props";
import { IAppState } from "states";
import { DirectoryPaneSide, StatusUpdate } from "types";

import "styles/App.scss";

/** The main application component. */
class App extends React.Component<IAppProps, IAppState> {

    /** Handler functions for the given events this component handles. */
    private handlers: IHandlers = {
        openCommandPalette: this.openCommandPalette,
        switchPane: this.switchPane
    };

    /** Notifies the status component of current application state. */
    private statusNotifier: IStatusNotifier;

    /** A timer used for the status message. */
    private statusMessageTimeout?: NodeJS.Timer;

    /** The integrated terminal for the left directory pane. */
    private leftTerminal: IIntegratedTerminal;

    /** The integrated terminal for the right directory pane. */
    private rightTerminal: IIntegratedTerminal;

    /**
     * Defines how the main app component is rendered.
     *
     * @param props the props for the component
     *
     * @returns a JSX element representing the app view
     */
    constructor(props: IAppProps) {
        super(props);

        this.statusNotifier = {
            notify: (payload: string) => this.updateStatus("notification", payload),
            setChosenCount: (payload: number) => this.updateStatus("chosenCount", payload),
            setItemCount: (payload: number) => this.updateStatus("itemCount", payload)
        };

        this.state = {
            isCommandPaletteOpen: false,
            selectedPane: "left",
            status: {
                chosenCount: 0,
                itemCount: 0,
                message: ""
            }
        };

        try {
            // Try to construct a terminal using shell path given in settings
            this.leftTerminal = new IntegratedTerminal(this.props.settingsManager);
            this.rightTerminal = new IntegratedTerminal(this.props.settingsManager);
        } catch {
            // Fallback to a pre-defined, system-dependent shell
            const useFallbackShell = true;
            this.leftTerminal = new IntegratedTerminal(this.props.settingsManager, useFallbackShell);
            this.rightTerminal = new IntegratedTerminal(this.props.settingsManager, useFallbackShell);
        }
    }

    /**
     * Defines how the main application component is rendered
     *
     * @returns a JSX element representing the main application view
     */
    public render(): JSX.Element {
        const { directoryManager, keysManager, settingsManager, themeManager } = this.props;
        const appStyle = { color: themeManager.theme.primaryColour };
        const resizerStyle: React.CSSProperties = {
            backgroundColor: this.props.themeManager.theme.resizers.colour
        };

        return <div>
            <HotKeys keyMap={keysManager.keyMap} handlers={this.handlers}>
                <div className="App" style={appStyle}>
                    <div className="main">
                        <SplitPane
                            split="vertical"
                            defaultSize="50vw"
                            resizerStyle={resizerStyle}>
                            <DirectoryWrapper
                                id="left"
                                initialPath={os.homedir()}
                                isSelectedPane={this.state.selectedPane === "left"}
                                sendSelectedPaneUp={this.selectPane}
                                directoryManager={directoryManager}
                                statusNotifier={this.statusNotifier}
                                settingsManager={settingsManager}
                                theme={themeManager.theme}
                                integratedTerminal={this.leftTerminal} />
                            <DirectoryWrapper
                                id="right"
                                initialPath={os.homedir()}
                                isSelectedPane={this.state.selectedPane === "right"}
                                sendSelectedPaneUp={this.selectPane}
                                directoryManager={directoryManager}
                                statusNotifier={this.statusNotifier}
                                settingsManager={settingsManager}
                                theme={themeManager.theme}
                                integratedTerminal={this.rightTerminal} />
                        </SplitPane>
                    </div>
                    <Status {...this.state.status} theme={themeManager.theme} />
                </div>
            </HotKeys>
            <CommandPalette
                isOpen={this.state.isCommandPaletteOpen}
                onClose={this.closeCommandPalette}
                applicationCommands={ApplicationCommander.commands}
                theme={this.props.themeManager.theme} />
        </div>;
    }

    /** Handles closing the quick select modal, if not already closed. */
    @autobind
    private closeCommandPalette() {
        if (this.state.isCommandPaletteOpen) {
            this.setState({ isCommandPaletteOpen: false } as IAppState);
        }
    }

    /** Handles opening the quick select modal, if not already open. */
    @autobind
    private openCommandPalette() {
        if (!this.state.isCommandPaletteOpen) {
            this.setState({ isCommandPaletteOpen: true } as IAppState);
        }
    }

    /**
     * Handles updating the status component's message.
     *
     * @param updateType the type of the status update
     * @param payload the data to use in the status update
     */
    @autobind
    private updateStatus(updateType: StatusUpdate, payload: string | number) {
        const status = this.state.status;
        const statusTimeout = 2000;

        if (updateType === "itemCount") {
            status.itemCount = payload as number;
        } else if (updateType === "chosenCount") {
            status.chosenCount = payload as number;
        } else {
            status.message = payload as string;
            this.statusMessageTimeout && clearTimeout(this.statusMessageTimeout);
            this.statusMessageTimeout = setTimeout(() => {
                status.message = "";
                this.setState({ status } as IAppState);
            }, statusTimeout);
        }

        this.setState({ status } as IAppState);
    }

    /** Handles switching selected pane. */
    @autobind
    private switchPane() {
        const { selectedPane } = this.state;

        if (selectedPane === "left") {
            this.selectPane("right");
        } else {
            this.selectPane("left");
        }
    }

    /**
     * Handles selecting the given pane.
     *
     * @param paneToSelect the pane to select, if not currently selected
     */
    @autobind
    private selectPane(paneToSelect: DirectoryPaneSide) {
        if (paneToSelect !== this.state.selectedPane) {
            this.setState({ selectedPane: paneToSelect } as IAppState);
        }
    }
}

export default App;
