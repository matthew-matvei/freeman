import { injectable } from "inversify";

import { IConfigManager } from "configuration";

const electron = require("electron");
const app = electron.app || electron.remote.app;

/**
 * Manages parsing configuration from application and user settings files.
 */
@injectable()
class ConfigManager implements IConfigManager {

    /** Gets the path to the user-specific data directory. */
    public get userDataDirectory(): string {
        return app.getPath("userData");
    }

    /** Gets the name of this application. */
    public get applicationName(): string {
        return process.env.NODE_ENV === "production" ? app.getName() : "FreeMAN";
    }
}

export default ConfigManager;
