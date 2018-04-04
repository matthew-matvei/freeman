import { inject, injectable } from "inversify";
import * as pty from "node-pty";
import { ITerminal, ProcessEnv } from "node-pty/lib/interfaces";
import os from "os";
import Xterm from "xterm";

import TYPES from "ioc/types";
import { ISettingsManager } from "managers";
import { IIntegratedTerminal } from "objects";

/** An integrated, interactive terminal. */
@injectable()
class IntegratedTerminal implements IIntegratedTerminal {

    /** A settings manager for terminal configuration.  */
    private readonly settingsManager: ISettingsManager;

    /** A private instance of the xterm terminal emulator. */
    private readonly xterm: Xterm;

    /** A spawned terminal process for shell execution. */
    private readonly ptyProcess: ITerminal;

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

        this.ptyProcess = pty.spawn(this.shell, [], {
            cwd: process.cwd(),
            env: process.env as ProcessEnv
        });

        (Xterm as any).loadAddon("fit");
        this.xterm = new Xterm({
            cursorBlink: this.settingsManager.settings.terminal.cursorBlink
        });

        this.xterm.on("data", data => {
            this.ptyProcess.write(data);
        });

        this.ptyProcess.on("data", data => {
            this.xterm.write(data);
        });
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
        this.ptyProcess.resize(this.xterm.cols, this.xterm.rows);
    }

    /** @inheritDoc */
    public changeDirectory(pathToDirectory: string): void {
        const changeDirectoryCommand = `cd '${pathToDirectory}'${os.EOL}`;
        this.ptyProcess.write(changeDirectoryCommand);
    }
}

export default IntegratedTerminal;
