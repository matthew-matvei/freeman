import { ipcRenderer } from "electron";

import { IApplicationCommands } from "models";

/** Provides static application-level commands. */
class ApplicationCommander {

    /** Gets the commands this commander handles. */
    public static get commands(): IApplicationCommands {
        return {
            reloadWindow: ApplicationCommander.reloadWindow
        };
    }

    /** Reloads the window by sending a reload-request to the main process. */
    private static reloadWindow() {
        ipcRenderer.send("reload-request");
    }
}

export default ApplicationCommander;
