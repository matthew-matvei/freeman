import { inject, injectable } from "inversify";
import * as pty from "node-pty";
import { ITerminal, ProcessEnv } from "node-pty/lib/interfaces";
import Terminal from "xterm";

import TYPES from "ioc/types";
import { ISettingsManager } from "managers";
import { IIntegratedTerminal } from "objects";

/** An integrated, interactive terminal. */
@injectable()
class IntegratedTerminal implements IIntegratedTerminal {

    /** A settings manager for terminal configuration.  */
    private settingsManager: ISettingsManager;

    /** A private instance of the xterm terminal emulator. */
    private xterm: Terminal;

    /** A spawned terminal process for shell execution. */
    private ptyProcess: ITerminal;

    /**
     * Initialises a new instance of the IntegratedTerminal class.
     *
     * @param settingsManager - a settings manager for terminal configuration
     */
    public constructor(
        @inject(TYPES.ISettingsManager) settingsManager: ISettingsManager
    ) {
        this.settingsManager = settingsManager;

        this.ptyProcess = pty.spawn(this.shell, [], {
            cwd: process.cwd(),
            env: process.env as ProcessEnv
        });

        (Terminal as any).loadAddon("fit");
        this.xterm = new Terminal({
            cursorBlink: this.settingsManager.settings.terminal.cursorBlink
        });

        this.xterm.on("data", data => {
            this.ptyProcess.write(data);
        });

        this.ptyProcess.on("data", data => {
            this.xterm.write(data);
        });
    }

    /** Gets the path or name of the system-dependent and configurable shell. */
    private get shell(): string {
        const { windows, linux } = this.settingsManager.settings;

        if (process.platform === "win32") {
            return windows.shell;
        } else {
            return linux.shell;
        }
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
}

export default IntegratedTerminal;
