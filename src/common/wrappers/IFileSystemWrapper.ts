import fs from "fs";

/** Provides a wrapper interface for file system operations. */
interface IFileSystemWrapper {

    /**
     * Provides a promisified wrapper of the fs.lstat function.
     *
     * @param path - the path to perform fs.lstat on
     *
     * @returns a promise of the result of fs.lstat of path
     */
    lstatAsync(path: fs.PathLike): Promise<fs.Stats>;

    /**
     * Provides a promisified wrapper of the fs.rmdir function.
     *
     * @param path - the path to perform fs.rmdir on
     */
    rmdirAsync(path: fs.PathLike): Promise<void>;

    /**
     * Provides a promisified wrapper of the fs.unlink function.
     *
     * @param path - the path to perform fs.unlink on
     */
    unlinkAsync(path: fs.PathLike): Promise<void>;

    /**
     * Provides a promisified wrapper of the fs.rename function.
     *
     * @param oldPath - the old path to be renamed
     * @param newPath - the new path after renaming is performed
     */
    renameAsync(oldPath: fs.PathLike, newPath: fs.PathLike): Promise<void>;

    /**
     * Provides a promisified wrapper of the fs.mkdir function.
     *
     * @param path - the path to the directory to create
     * @param mode - the mode to use when creating the directory
     */
    mkdirAsync(path: fs.PathLike, mode?: string | number | null | undefined): Promise<void>;

    /**
     * Provides a promisified wrapper of the ncp.ncp function.
     *
     * @param arg1 - the path to copy the directory item from
     * @param arg2 - the path to copy the directory item to
     */
    copyAsync(arg1: string, arg2: string): Promise<void>;

    /**
     * Provides a promisified wrapper of the fs.writeFile function.
     *
     * @param path - the path to the file to create
     * @param data - the data to write to the newly-created file
     * @param options - options to use when creating the new file
     */
    writeFileAsync(
        path: string | number | Buffer | URL,
        data: any,
        options?: string | {
            encoding?: string | null | undefined,
            mode?: string | number | undefined,
            flag?: string | undefined
        } | null | undefined
    ): Promise<void>;

    /**
     * Provides a promisified wrapper of the fs.access function.
     *
     * @param path - the path to access
     * @param mode - the mode to use when accessing the path
     */
    accessAsync(path: fs.PathLike, mode?: number | undefined): Promise<void>;

    /**
     * Provides a promisified wrapper of the fs.readdir function.
     *
     * @param path - the path to the directory whose contents are to be read
     * @param options - options to use when reading the directory's contents
     *
     * @returns a list of child directory item paths under the given path
     */
    readdirAsync(
        path: fs.PathLike,
        options?: {
            encoding: "ascii" | "utf8" | "utf16le" | "ucs2" | "base64" | "latin1" | "binary" | "hex" | null
        } | "ascii" | "utf8" | "utf16le" | "ucs2" | "base64" | "latin1" | "binary" | "hex" | null | undefined):
        Promise<string[]>;
}

export default IFileSystemWrapper;
