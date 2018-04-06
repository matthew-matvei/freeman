import { inject, injectable } from "inversify";
import os from "os";
import Xterm from "xterm";

import TYPES from "ioc/types";
import { ISettingsManager } from "managers";
import { IIntegratedTerminal, IShell, Shell } from "objects";

/** An integrated, interactive terminal. */
@injectable()
class IntegratedTerminal implements IIntegratedTerminal {

    /** A settings manager for terminal configuration.  */
    private readonly settingsManager: ISettingsManager;

    /** A private instance of the xterm terminal emulator. */
    private readonly xterm: Xterm;

    /** A spawned terminal process for shell execution. */
    private readonly terminalProcess: IShell;

    /** Whether to use a safe, fallback shell */
    private readonly useFallbackShell: boolean;

    /**
     * Initialises a new instance of the IntegratedTerminal class.
     *
     * @param settingsManager a settings manager for terminal configuration
     * @param useFallbackShell whether to use a safe, fallback shell, defaults to false
     */
    public constructor(
        @inject(TYPES.ISettingsManager) settingsManager: ISettingsManager,
        useFallbackShell = false
    ) {
        this.settingsManager = settingsManager;
        this.useFallbackShell = useFallbackShell;

        (Xterm as any).loadAddon("fit");
        this.xterm = new Xterm({
            cursorBlink: this.settingsManager.settings.terminal.cursorBlink
        });

        this.xterm.on("data", data => {
            this.terminalProcess.write(data);
        });

        this.terminalProcess = new Shell(this.shell, this.xterm);
    }

    /** @inheritDoc */
    public get shell(): string {
        return this.useFallbackShell ? this.fallbackShell : this.configuredShell;
    }

    /** Gets the path or name of the shell configured in user settings. */
    private get configuredShell(): string {
        const { windows, linux } = this.settingsManager.settings;

        if (process.platform === "win32") {
            return windows.shell;
        } else {
            return linux.shell;
        }
    }

    /** Gets the path or name of the fallback shell used as a fail-safe. */
    private get fallbackShell(): string {
        return process.platform === "win32" ? "powershell.exe" : "bash";
    }

    /** @inheritDoc */
    public openIn(element: HTMLDivElement): void {
        this.xterm.open(element);
        (this.xterm as any).fit!();
    }

    /** @inheritDoc */
    public fitTo(element: HTMLDivElement): void {
        (this.xterm as any).fit!();
        this.terminalProcess.resize(this.xterm.cols, this.xterm.rows);
    }

    /** @inheritDoc */
    public changeDirectory(pathToDirectory: string): void {
        const changeDirectoryCommand = `cd '${pathToDirectory}'${os.EOL}`;
        this.terminalProcess.write(changeDirectoryCommand);
    }
}

export default IntegratedTerminal;
