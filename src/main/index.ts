import { app, dialog, ipcMain, Menu } from "electron";
import { ConfigInstaller } from "configuration";
require("electron-debug")();

import { TerminalService } from "services";
import { FreemanWindow } from "widgets";

let mainWindow: FreemanWindow | null = null;
let terminalService: TerminalService;

if (process.argv.includes("--installConfig")) {
    const installer = new ConfigInstaller();
    installer.install().then((onfulfilled: void) => {
        app.exit(0);
    }).catch((onrejected: void) => {
        app.exit(1);
    });
} else {
    terminalService = new TerminalService();
    buildWindow(mainWindow);
}

/** Handles constructing the main window. */
function buildWindow(window: FreemanWindow | null) {
    app.on("activate", () => {
        if (window === null) {
            buildWindow(window);
        }
    });

    app.on("window-all-closed", () => {
        if (process.platform !== "darwin") {
            app.quit();
        }
    });

    app.on("ready", () => {
        window = new FreemanWindow();
        const menu = Menu.buildFromTemplate(FreemanWindow.menuTemplate);
        Menu.setApplicationMenu(menu);

        window.once("ready-to-show", () => {
            window!.show()
        });

        window.on("closed", () => {
            terminalService.close();
            window = null;
        });

        window.on("unresponsive", () => {
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
