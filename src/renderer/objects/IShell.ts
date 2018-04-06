import Xterm from "xterm";

interface IShell {
    spawn(shellName: string): void;
    write(data: any): void;
    resize(columns: number, rows: number): void;
    attach(xterm: Xterm): void;
}

export default IShell;
