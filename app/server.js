const { app, BrowserWindow, dialog } = require("electron");
require("electron-debug")();

let mainWindow;

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("ready", () => {
    mainWindow = new BrowserWindow({ width: 1400, height: 800 });
    mainWindow.loadURL(`file://${__dirname}/index.html`);

    mainWindow.once("ready-to-show", () => {
        mainWindow.show()
    });

    mainWindow.on("closed", () => {
        mainWindow = null;
    });

    mainWindow.on("unresponsive", () => {
        const killIndex = 0;
        const cancelIndex = 1;
        const kill = dialog.showMessageBox(mainWindow, {
            type: "warning",
            buttons: ["OK", "Wait"],
            defaultId: killIndex,
            cancelId: cancelIndex,
            title: "FreeMAN unresponsive",
            message: "Would you like to kill the process?"
        });
    });

    mainWindow.webContents.on("crashed", (event, killed) => {
        if (killed) {
            return;
        }

        dialog.showErrorBox("FreeMAN crashed", event);
    });

    // mainWindow.setMenu(null);
});
