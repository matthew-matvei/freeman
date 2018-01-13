import "reflect-metadata";
import { app, dialog, ipcMain, Menu } from "electron";
require("electron-debug")({ enabled: true });

import { ITerminalService } from "services";
import { FreemanWindow } from "widgets";
import Utils from "Utils";
import container from "ioc/container";
import TYPES from "ioc/types";
import { ISettingsManager } from "managers";

let mainWindow: FreemanWindow | null = null;

if (process.argv.includes("--verbose")) {
    process.env.VERBOSE = 1;
    Utils.trace("Running application in verbose mode");
}

const settingsManager = container.get<ISettingsManager>(TYPES.ISettingsManager);
const terminalService = container.get<ITerminalService>(TYPES.ITerminalService);
buildWindow(mainWindow);

/** Handles constructing the main window. */
function buildWindow(window: FreemanWindow | null) {
    app.on("activate", () => {
        if (window === null) {
            Utils.trace("Building window");
            buildWindow(window);
        }
    });

    app.on("window-all-closed", () => {
        if (process.platform !== "darwin") {
            Utils.trace("Shutting application down");
            app.quit();
        }
    });

    app.on("ready", () => {
        const windowOptions: Electron.BrowserWindowConstructorOptions = {
            title: "FreeMAN",
            width: 1400,
            height: 800,
            minWidth: 700,
            minHeight: 400,
            disableAutoHideCursor: true,
            backgroundColor: "#272822",
        };

        window = new FreemanWindow(windowOptions);
        settingsManager.settings.fullscreen && window.maximize();
        const menu = Menu.buildFromTemplate(FreemanWindow.menuTemplate);
        Menu.setApplicationMenu(menu);

        window.on("closed", () => {
            terminalService.close();
            Utils.trace("Main window closing");
            window = null;
        });

        window.on("unresponsive", () => {
            Utils.trace("Main window unresponsive");
            const killIndex = 0;
            const cancelIndex = 1;
            const kill = dialog.showMessageBox(window!, {
                type: "warning",
                buttons: ["OK", "Wait"],
                defaultId: killIndex,
                cancelId: cancelIndex,
                title: "FreeMAN unresponsive",
                message: "Would you like to kill the process?"
            });

            if (kill === killIndex) {
                app.exit(1);
            }
        });

        ipcMain.on("reload-request", () => {
            window && window.reload();
        });
    });
}
