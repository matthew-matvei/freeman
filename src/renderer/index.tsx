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
import { IIntegratedTerminal, IntegratedTerminal, IPersister, IShell } from "objects";
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
const persister = container.get<IPersister>(TYPES.IPersister);
const leftTerminal = buildTerminal(settingsManager, leftShell);
const rightTerminal = buildTerminal(settingsManager, rightShell);

ReactDOM.render(<App
    settingsManager={settingsManager}
    keysManager={keysManager}
    themeManager={themeManager}
    directoryManager={directoryManager}
    persister={persister}
    leftTerminal={leftTerminal}
    rightTerminal={rightTerminal} />,
    document.getElementById("app-root"));

/**
 * Builds an integrated terminal using the given settings and shell.
 *
 * @param settings the settings manager to use in the built terminal
 * @param shell the shell process to use in the built terminal
 *
 * @returns an integrated terminal using the given settings and shell
 */
function buildTerminal(settings: ISettingsManager, shell: IShell): IIntegratedTerminal {
    try {
        return new IntegratedTerminal(settings, shell);
    } catch {
        const useFallbackShell = true;

        return new IntegratedTerminal(settings, shell, useFallbackShell);
    }
}
