import fs from "fs";

/** Provides a wrapper interface for file system operations. */
interface IFileSystemWrapper {

    lstatAsync(path: fs.PathLike): Promise<fs.Stats>;
    rmdirAsync(path: fs.PathLike): Promise<void>;
    unlinkAsync(path: fs.PathLike): Promise<void>;
    renameAsync(oldPath: fs.PathLike, newPath: fs.PathLike): Promise<void>;
    mkdirAsync(path: fs.PathLike, mode?: string | number | null | undefined): Promise<void>;
    copyFileAsync(arg1: string, arg2: string): Promise<void>;
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
}

export default IFileSystemWrapper;
