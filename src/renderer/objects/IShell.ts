import Xterm from "xterm";

/** Describes a thin facade of an underlying shell process of an integrated terminal. */
interface IShell {

    /**
     * Spawns a shell process using the given path or name.
     *
     * @param shellName the path or name of the shell to use
     */
    spawn(shellName: string): void;

    /**
     * Writes the given data to the shell process.
     *
     * @param data the data to write to the shell process
     */
    write(data: any): void;

    /**
     * Resizes the shell process's terminal viewport to the given columns and rows.
     *
     * @param columns the number of columns to resize to
     * @param rows the number of rows to resize to
     */
    resize(columns: number, rows: number): void;

    /**
     * Attaches the shell process with an xterm frontend interface.
     *
     * @param xterm an Xterm frontend instance
     */
    attach(xterm: Xterm): void;
}

export default IShell;
