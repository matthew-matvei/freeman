import { remote } from "electron";
import installExtension, { REACT_DEVELOPER_TOOLS } from "electron-devtools-installer";
import log from "electron-log";
import * as React from "react";
import * as ReactDOM from "react-dom";
import "reflect-metadata";

import { App } from "components";
import container from "ioc/container";
import TYPES from "ioc/types";
import {
    IDirectoryManager,
    IKeysManager,
    ISettingsManager,
    IThemesManager
} from "managers";
import { IIntegratedTerminal, IntegratedTerminal, IShell } from "objects";
import Utils from "Utils";

import "styles/main.scss";

installExtension(REACT_DEVELOPER_TOOLS)
    .then(name => log.info("Installed plugin", name))
    .catch(error => log.error(error));

if (remote.process.env.VERBOSE) {
    process.env.VERBOSE = "1";
    Utils.trace("Running renderer in verbose mode");
}

window.addEventListener("error", (event) => {
    log.error(event.error);
});

const settingsManager = container.get<ISettingsManager>(TYPES.ISettingsManager);
const keysManager = container.get<IKeysManager>(TYPES.IKeysManager);
const themeManager = container.get<IThemesManager>(TYPES.IThemesManager);
const directoryManager = container.get<IDirectoryManager>(TYPES.IDirectoryManager);
const leftShell = container.get<IShell>(TYPES.IShell);
const rightShell = container.get<IShell>(TYPES.IShell);
let leftTerminal: IIntegratedTerminal;
let rightTerminal: IIntegratedTerminal;

try {
    // Try to construct a terminal using shell path given in settings
    leftTerminal = new IntegratedTerminal(settingsManager, leftShell);
    rightTerminal = new IntegratedTerminal(settingsManager, rightShell);
} catch {
    // Fallback to a pre-defined, system-dependent shell
    const useFallbackShell = true;
    leftTerminal = new IntegratedTerminal(settingsManager, leftShell, useFallbackShell);
    rightTerminal = new IntegratedTerminal(settingsManager, rightShell, useFallbackShell);
}

ReactDOM.render(<App
    settingsManager={settingsManager}
    keysManager={keysManager}
    themeManager={themeManager}
    directoryManager={directoryManager}
    leftTerminal={leftTerminal}
    rightTerminal={rightTerminal} />,
    document.getElementById("app-root"));
