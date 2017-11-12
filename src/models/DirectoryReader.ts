import fs from "fs";
import { promisify } from "util";

/**
 * Provides static methods for reading files and folders.
 */
class DirectoryReader {

    private static readdirAsync = promisify(fs.readdir);
    private static lstatAsync = promisify(fs.lstat);

    /**
     * Returns a list of paths of all files in the directory given in path.
     *
     * @param path - the path to the directory to list
     *
     * @returns - a list of all files in the given directory
     */
    public static async ListDirectory(path: string): Promise<string[]> {
        if (!(await DirectoryReader.IsDirectory(path))) {
            return [];
        }

        return await DirectoryReader.readdirAsync(path);
    }

    /**
     * Returns whether the file at the given path is a directory.
     *
     * @param path - the path to the file
     *
     * @returns - whether the file is a directory
     */
    public static async IsDirectory(path: string): Promise<boolean> {
        const fileStats = await DirectoryReader.lstatAsync(path);

        return fileStats.isDirectory();
    }
}

export default DirectoryReader;
