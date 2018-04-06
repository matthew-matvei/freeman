import { injectable } from "inversify";
import * as pty from "node-pty";
import { ITerminal, ProcessEnv } from "node-pty/lib/interfaces";

import LoggedError from "errors/LoggedError";
import { IShell } from "objects";

@injectable()
class Shell implements IShell {

    private terminalProcess?: ITerminal;

    public spawn(shellName: string) {
        this.terminalProcess = pty.spawn(shellName, [], {
            cwd: process.cwd(),
            env: process.env as ProcessEnv
        });
    }

    public write(data: any) {
        this.terminalProcess && this.terminalProcess.write(data);
    }
    public resize(columns: number, rows: number) {
        this.terminalProcess && this.terminalProcess.resize(columns, rows);
    }

    public attach(xterm: Xterm) {
        if (!this.terminalProcess) {
            throw new LoggedError("Could not write to shell process before spawning");
        }

        xterm.on("data", data => {
            this.terminalProcess!.write(data);
        });

        this.terminalProcess.on("data", data => {
            xterm.write(data);
        });
    }
}

export default Shell;
