import { app, BrowserWindow, dialog } from "electron";
import { ConfigInstaller } from "configuration";
require("electron-debug")();

import { TerminalService } from "services";

let mainWindow: BrowserWindow | null = null;
let terminalService: TerminalService;

if (process.argv.find(arg => arg === "--installConfig")) {
    const installer = new ConfigInstaller();
    installer.install().then(onfulfilled => {
        app.exit(0);
    }).catch(onrejected => {
        app.exit(1);
    });
} else {
    terminalService = new TerminalService();
    buildWindow(mainWindow);
}

/**
 * Handles contructing the main
 */
function buildWindow(window: BrowserWindow | null) {
    app.on("activate", () => {
        if (mainWindow === null) {
            buildWindow(mainWindow);
        }
    });

    app.on("window-all-closed", () => {
        if (process.platform !== "darwin") {
            app.quit();
        }
    });

    app.on("ready", () => {
        mainWindow = new BrowserWindow({ width: 1400, height: 800 });
        mainWindow.loadURL(`file://${__dirname}/index.html`);

        mainWindow.once("ready-to-show", () => {
            mainWindow!.show()
        });

        mainWindow.on("closed", () => {
            terminalService.close();
            mainWindow = null;
        });

        mainWindow.on("unresponsive", () => {
            const killIndex = 0;
            const cancelIndex = 1;
            const kill = dialog.showMessageBox(mainWindow!, {
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

        mainWindow.webContents.on("crashed", (event, killed) => {
            if (killed) {
                return;
            }

            dialog.showErrorBox("FreeMAN crashed", "FreeMAN crashed");
        });

        // mainWindow.setMenu(null);
    });
}
