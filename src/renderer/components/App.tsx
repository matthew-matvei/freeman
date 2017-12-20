import * as React from "react";
import * as PropTypes from "prop-types";
import os from "os";
import SplitPane from "react-split-pane";
import { HotKeys } from "react-hotkeys";
import autobind from "autobind-decorator";

import TYPES from "ioc/types";
import container from "ioc/container";
import { DirectoryWrapper, Status } from "components/panels";
import { CommandPalette } from "components/modals";
import { IAppState } from "states";
import { IKeyMap, ISettings, ITheme, IAppContext } from "models";
import { ApplicationCommander } from "objects";
import { IDirectoryManager, KeysManager, SettingsManager, ThemesManager } from "objects/managers";
import { DirectoryPaneSide } from "types";
import { IConfigManager } from "configuration";

import "styles/App.scss";

/** The main application component. */
class App extends React.Component<{}, IAppState> {

    /** Validation for child context types. */
    public static childContextTypes = {
        theme: PropTypes.object
    }

    /** Settings to use in the application. */
    private settings: ISettings;

    /** The global key map to pass down to child components. */
    private keyMap: IKeyMap | null;

    /** The colour theme to use in the application. */
    private theme: ITheme;

    /** Handler functions for the given events this component handles. */
    private handlers = {
        switchPane: this.switchPane,
        openCommandPalette: this.openCommandPalette
    }

    /**
     * Gets a string representing the current status of the application
     */
    private get currentStatus(): string {
        if (!this.keyMap) {
            return "No key map files found!";
        }

        return "Ready";
    }

    /**
     * Defines how the main app component is rendered.
     *
     * @returns - a JSX element representing the app view
     */
    constructor(props: {}) {
        super(props);

        const configManager = container.get<IConfigManager>(TYPES.IConfigManager);
        this.settings = new SettingsManager(configManager).retrieve();
        this.keyMap = new KeysManager(configManager).retrieve();
        this.theme = new ThemesManager(configManager).retrieve(this.settings.themeName);

        this.state = {
            selectedPane: "left",
            isCommandPaletteOpen: false
        }
    }

    /** Returns the child context to pass down the component tree. */
    public getChildContext(): IAppContext {
        return { theme: this.theme };
    }

    /**
     * Defines how the main application component is rendered
     *
     * @returns - a JSX element representing the main application view
     */
    public render(): JSX.Element {
        const appStyle = { color: this.theme.primaryColour };
        const splitPaneStyle = { height: "97vh" };

        const directoryManager = container.get<IDirectoryManager>(TYPES.IDirectoryManager);

        return <div>
            <HotKeys keyMap={this.keyMap || undefined} handlers={this.handlers}>
                <div className="App" style={appStyle}>
                    <SplitPane
                        split="vertical"
                        defaultSize="50vw"
                        style={splitPaneStyle}>
                        <DirectoryWrapper
                            id="left"
                            initialPath={os.homedir()}
                            isSelectedPane={this.state.selectedPane === "left"}
                            sendSelectedPaneUp={this.selectPane}
                            directoryManager={directoryManager} />
                        <DirectoryWrapper
                            id="right"
                            initialPath={os.homedir()}
                            isSelectedPane={this.state.selectedPane === "right"}
                            sendSelectedPaneUp={this.selectPane}
                            directoryManager={directoryManager} />
                    </SplitPane>
                    <Status message={this.currentStatus} />
                </div>
            </HotKeys>
            <CommandPalette
                isOpen={this.state.isCommandPaletteOpen}
                onClose={this.closeCommandPalette}
                applicationCommands={ApplicationCommander.commands} />
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

    /** Handles switching selected pane. */
    @autobind
    private switchPane() {
        const { selectedPane } = this.state;

        if (selectedPane === "left") {
            this.setState({ selectedPane: "right" } as IAppState);
        } else {
            this.setState({ selectedPane: "left" } as IAppState)
        }
    }

    /**
     * Handles selecting the given pane.
     *
     * @param paneToSelect - the pane to select, if not currently selected
     */
    @autobind
    private selectPane(paneToSelect: DirectoryPaneSide) {
        if (paneToSelect !== this.state.selectedPane) {
            this.setState({ selectedPane: paneToSelect } as IAppState);
        }
    }
}

export default App;
