import { app, dialog, ipcMain, Menu } from "electron";
import windowStateKeeper from "electron-window-state";
import "reflect-metadata";

import { ArgumentsParser } from "arguments";
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

const isDev = require("electron-is-dev");
if (parsedArguments.openInDevelopment || isDev) {
    require("electron-debug")({ enabled: true, showDevTools: false });
}

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        Utils.trace("Shutting application down");
        app.quit();
    }
});

app.on("ready", () => {
    dialog.showMessageBox({
        buttons: ["I accept"],
        detail: "FreeMAN is currently in active development and intended for development purposes only. " +
            "It's possible for a user to delete files / folders, bypassing the operating system's Recycle Bin " +
            "equivalent, for example. It is currently not advised to use the program with important files / folders.",
        message: "This program is currently Pre-Release and should be used carefully",
        title: "Pre-release warning",
        type: "warning"
    }).catch(e => console.error(e));

    const mainWindowState = windowStateKeeper({
        defaultHeight: 800,
        defaultWidth: 1400
    });

    const windowOptions: Electron.BrowserWindowConstructorOptions = {
        backgroundColor: "#272822",
        disableAutoHideCursor: true,
        fullscreen: mainWindowState.isFullScreen,
        height: mainWindowState.height,
        minHeight: 400,
        minWidth: 700,
        show: false,
        title: "FreeMAN",
        width: mainWindowState.width,
        x: mainWindowState.x,
        y: mainWindowState.y
    };

    mainWindow = new FreemanWindow(windowOptions);
    mainWindowState.manage(mainWindow);

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
        const kill = dialog.showMessageBoxSync(mainWindow!, {
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
