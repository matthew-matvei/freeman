const electron = require("electron");
const app = electron.app || electron.remote.app;

/**
 * Manages parsing configuration from application and user settings files.
 */
class ConfigManager {

    /**
     * Gets the path to the application data directory.
     */
    public get applicationDataDirectory() {
        return app.getPath("appData");
    }

    /**
     * Gets the path to the user-specific data directory.
     */
    public get userDataDirectory() {
        return app.getPath("userData");
    }

    /**
     * Gets the name of this application.
     */
    public get applicationName() {
        return process.env === "production" ? app.getName() : "FreeMAN";
    }
}

export default ConfigManager;
