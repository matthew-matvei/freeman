import fs from "fs";

/** Provides a wrapper interface for file system operations. */
interface IFileSystemWrapper {

    lstatAsync(path: fs.PathLike): Promise<fs.Stats>;
    rmdirAsync(path: fs.PathLike): Promise<void>;
    unlinkAsync(path: fs.PathLike): Promise<void>;
    renameAsync(oldPath: fs.PathLike, newPath: fs.PathLike): Promise<void>;
    mkdirAsync(path: fs.PathLike, mode?: string | number | null | undefined): Promise<void>;
    copyAsync(arg1: string, arg2: string): Promise<void>;
    writeFileAsync(
        path: string | number | Buffer | URL,
        data: any,
        options?: string | {
            encoding?: string | null | undefined,
            mode?: string | number | undefined,
            flag?: string | undefined
        } | null | undefined
    ): Promise<void>;
    accessAsync(path: fs.PathLike, mode?: number | undefined): Promise<void>;
    readdirAsync(
        path: fs.PathLike,
        options?: {
            encoding: "ascii" | "utf8" | "utf16le" | "ucs2" | "base64" | "latin1" | "binary" | "hex" | null
        } | "ascii" | "utf8" | "utf16le" | "ucs2" | "base64" | "latin1" | "binary" | "hex" | null | undefined):
        Promise<string[]>;
}

export default IFileSystemWrapper;
