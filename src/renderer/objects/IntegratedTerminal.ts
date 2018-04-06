import { inject, injectable } from "inversify";
import os from "os";
import Xterm from "xterm";

import TYPES from "ioc/types";
import { ISettingsManager } from "managers";
import { IIntegratedTerminal, IShell } from "objects";

/** An integrated, interactive terminal. */
@injectable()
class IntegratedTerminal implements IIntegratedTerminal {

    /** A settings manager for terminal configuration.  */
    private readonly settingsManager: ISettingsManager;

    /** The backend shell process the terminal uses. */
    private readonly shell: IShell;

    /** Whether to use a safe, fallback shell */
    private readonly useFallbackShell: boolean;

    /** A private instance of the xterm terminal emulator. */
    private readonly xterm: Xterm;

    /**
     * Initialises a new instance of the IntegratedTerminal class.
     *
     * @param settingsManager a settings manager for terminal configuration
     * @param shell the backend shell process the terminal uses
     * @param useFallbackShell whether to use a safe, fallback shell, defaults to false
     */
    public constructor(
        @inject(TYPES.ISettingsManager) settingsManager: ISettingsManager,
        @inject(TYPES.IShell) shell: IShell,
        useFallbackShell = false
    ) {
        this.settingsManager = settingsManager;
        this.shell = shell;
        this.useFallbackShell = useFallbackShell;

        (Xterm as any).loadAddon("fit");
        this.xterm = new Xterm({
            cursorBlink: this.settingsManager.settings.terminal.cursorBlink
        });

        this.shell.spawn(this.shellName);
        this.shell.attach(this.xterm);
    }

    /** @inheritDoc */
    public get shellName(): string {
        return this.useFallbackShell ? this.fallbackShellName : this.configuredShellName;
    }

    /** Gets the path or name of the shell configured in user settings. */
    private get configuredShellName(): string {
        const { windows, linux } = this.settingsManager.settings;

        if (process.platform === "win32") {
            return windows.shell;
        } else {
            return linux.shell;
        }
    }

    /** Gets the path or name of the fallback shell used as a fail-safe. */
    private get fallbackShellName(): string {
        return process.platform === "win32" ? "powershell.exe" : "bash";
    }

    /** @inheritDoc */
    public openIn(element: HTMLDivElement): void {
        this.xterm.open(element);
        (this.xterm as any).fit!();
    }

    /** @inheritDoc */
    public fit(): void {
        (this.xterm as any).fit!();
        this.shell.resize(this.xterm.cols, this.xterm.rows);
    }

    /** @inheritDoc */
    public changeDirectory(pathToDirectory: string): void {
        const changeDirectoryCommand = `cd '${pathToDirectory}'${os.EOL}`;
        this.shell.write(changeDirectoryCommand);
    }
}

export default IntegratedTerminal;
