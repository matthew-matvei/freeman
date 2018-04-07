import { app, dialog, ipcMain, Menu } from "electron";
import "reflect-metadata";
require("electron-debug")({ enabled: true });

import { ArgumentsParser } from "arguments";
import container from "ioc/container";
import TYPES from "ioc/types";
import { ISettingsManager } from "managers";
import Utils from "Utils";
import { FreemanWindow } from "widgets";

let mainWindow: FreemanWindow | null = null;

const parsedArguments = ArgumentsParser.parse(process.argv);

if (parsedArguments.version) {
    console.info(app.getVersion());
    process.exit(0);
}

if (parsedArguments.verbose) {
    process.env.VERBOSE = "1";
    Utils.trace("Running application in verbose mode");
}

const settingsManager = container.get<ISettingsManager>(TYPES.ISettingsManager);

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        Utils.trace("Shutting application down");
        app.quit();
    }
});

app.on("ready", () => {
    const windowOptions: Electron.BrowserWindowConstructorOptions = {
        backgroundColor: "#272822",
        disableAutoHideCursor: true,
        height: 800,
        minHeight: 400,
        minWidth: 700,
        show: false,
        title: "FreeMAN",
        width: 1400
    };

    mainWindow = new FreemanWindow(windowOptions);
    settingsManager.settings.fullscreen && mainWindow.maximize();
    const menu = Menu.buildFromTemplate(FreemanWindow.menuTemplate);
    Menu.setApplicationMenu(menu);

    mainWindow.on("closed", () => {
        Utils.trace("Main window closing");
        mainWindow = null;
    });

    mainWindow.on("unresponsive", () => {
        Utils.trace("Main window unresponsive");
        const killIndex = 0;
        const cancelIndex = 1;
        const kill = dialog.showMessageBox(mainWindow!, {
            buttons: ["OK", "Wait"],
            cancelId: cancelIndex,
            defaultId: killIndex,
            message: "Would you like to kill the process?",
            title: "FreeMAN unresponsive",
            type: "warning"
        });

        if (kill === killIndex) {
            app.exit(1);
        }
    });

    ipcMain.on("reload-request", () => {
        mainWindow && mainWindow.reload();
    });
});
