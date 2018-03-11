import { ipcRenderer } from "electron";

import { IApplicationCommands } from "models";

/** Provides static application-level commands. */
export default {

    /** Gets the commands this commander handles. */
    get commands(): IApplicationCommands {
        return {
            reloadWindow
        };
    }
};

/** Reloads the window by sending a reload-request to the main process. */
function reloadWindow() {
    ipcRenderer.send("reload-request");
}
