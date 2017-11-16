const { app, BrowserWindow } = require("electron");

let mainWindow;

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("ready", () => {
    mainWindow = new BrowserWindow({ width: 1400, height: 800 });
    mainWindow.loadURL(`file://${__dirname}/index.html`);
    mainWindow.once('ready-to-show', () => {
        mainWindow.show()
    });
    mainWindow.on("closed", () => {
        mainWindow = null;
    });
});
