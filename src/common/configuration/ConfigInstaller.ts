import { ConfigManager } from "configuration";
import mkdirp from "mkdirp";
import ncp from "ncp";
import path from "path";

/** Provides an install method for installing config files during development. */
class ConfigInstaller {

    /** The underlying config manager providing application paths. */
    private configManager: ConfigManager;

    /** The name of the local resource folder. */
    private static readonly resourceFolder = "resources";

    /** The name of the local and destination themes folder. */
    private static readonly themesFolder = "themes";

    /** Initialises a new instance of the ConfigInstaller class. */
    public constructor() {
        this.configManager = new ConfigManager();
    }

    /** Installs all configuration files. */
    public async install() {
        await this.makeApplicationDirectory();
        await this.installSettings();
        await this.installKeyMappings();
        await this.installThemes();
    }

    /** Creates the application destination directory. */
    private async makeApplicationDirectory() {
        await this.makeDirAsync(path.join(
            this.configManager.applicationDataDirectory,
            this.configManager.applicationName));
        await this.makeDirAsync(path.join(
            this.configManager.applicationDataDirectory,
            this.configManager.applicationName,
            ConfigInstaller.themesFolder));
    }

    /** Copies the settings file. */
    private async installSettings() {
        await this.cpAsync(path.join(
            ConfigInstaller.resourceFolder,
            "settings.json"), path.join(
                this.configManager.applicationDataDirectory,
                this.configManager.applicationName,
                "settings.json"));
    }

    /** Copies the key mappings file. */
    private async installKeyMappings() {
        await this.cpAsync(path.join(
            ConfigInstaller.resourceFolder,
            "keys.json"), path.join(
                this.configManager.applicationDataDirectory,
                this.configManager.applicationName,
                "keys.json"));
    }

    /** Copies the themes 'dark.json' file. */
    private async installThemes() {
        await this.cpAsync(path.join(
            ConfigInstaller.resourceFolder,
            ConfigInstaller.themesFolder,
            "dark.json"), path.join(
                this.configManager.applicationDataDirectory,
                this.configManager.applicationName,
                ConfigInstaller.themesFolder,
                "dark.json"));
    }

    /**
     * Promisifies the mkdirp function.
     *
     * @param filePath - the path to the directory to create
     */
    private makeDirAsync(filePath: string): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            mkdirp(filePath, error => {
                if (error) {
                    reject(error);
                }

                resolve();
            })
        });
    }

    /**
     * Promisifies the ncp.ncp function.
     *
     * @param source - the source file path
     * @param destination - the destination file path
     */
    private cpAsync(source: string, destination: string): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            ncp.ncp(source, destination, error => {
                if (error) {
                    reject(error);
                }

                resolve();
            })
        });
    }
}

export default ConfigInstaller;
