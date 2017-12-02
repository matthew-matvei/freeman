import { BrowserWindow, dialog } from "electron";
import path from "path";

/** The main BrowserWindow used in the FreeMAN application. */
class FreemanWindow extends BrowserWindow {

    /** Static constructor options passed to the super class. */
    private static readonly options: Electron.BrowserWindowConstructorOptions = {
        title: "FreeMAN",
        width: 1400,
        height: 800,
        minWidth: 700,
        minHeight: 400,
        disableAutoHideCursor: true,
        backgroundColor: "#272822"
    }

    /** Initialises a new instance of the Freemanwindow class. */
    public constructor() {
        super(FreemanWindow.options);

        this.setupHandlers();
        this.loadURL(path.join(`file://${__dirname}`, "index.html"));
    }

    /** Gets the template for the window's menu. */
    public static get menuTemplate(): Electron.MenuItemConstructorOptions[] {
        return [
            {
                label: "File",
                submenu: [{ role: "quit" }]
            },
            { role: "windowMenu" }
        ]
    }

    /**
     * Sets up any handlers that are not connected to other elements of the
     * main process.
     */
    private setupHandlers() {
        this.webContents.on("crashed", (event, killed) => {
            if (killed) {
                return;
            }

            dialog.showErrorBox("FreeMAN crashed", "FreeMAN crashed");
        });
    }
}

export default FreemanWindow;
