import * as pty from "node-pty";
import { ProcessEnv, ITerminal } from 'node-pty/lib/interfaces';

import { IShell } from "objects";


class Shell implements IShell {

    private readonly shellPath: string;

    private readonly xterm: Xterm;

    private terminalProcess?: ITerminal;

    public constructor(shellPath: string, xterm: Xterm) {
        this.shellPath = shellPath;
        this.xterm = xterm;
    }

    spawn(): void {
        this.terminalProcess = pty.spawn(this.shellPath, [], {
            cwd: process.cwd(),
            env: process.env as ProcessEnv
        });

        this.terminalProcess.on("data", data => {
            this.xterm.write(data);
        });
    }
}

export default Shell;
