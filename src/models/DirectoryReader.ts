import fs from "fs";

/**
 * Provides static methods for reading files and folders.
 */
class DirectoryReader {

    /**
     * Returns a list of paths in the directory given by path.
     *
     * @param path - the path to the directory whose contents are to be listed
     *
     * @returns - a list of paths in the directory at the given path
     */
    private static async readDirectoryAsync(path: string): Promise<string[]> {
        return new Promise<string[]>((resolve, reject) => {
            fs.readdir(path, (error, files) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(files);
                }
            });
        });
    }

    /**
     * Returns file stats on the file or directory at the given path.
     *
     * @param path - the path to the directory whose stats are to be gotten
     *
     * @returns - the stats for the given file or directory
     */
    private static async lstatAsync(path: string): Promise<fs.Stats> {
        return new Promise<fs.Stats>((resolve, reject) => {
            fs.lstat(path, (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            });
        });
    }

    /**
     * Returns a list of paths of all files in the directory given in path.
     *
     * @param path - the path to the directory to list
     *
     * @returns - a list of all files in the given directory
     */
    public static async ListDirectory(path: string): Promise<string[]> {
        if (!(await this.IsDirectory(path))) {
            return [];
        }

        return await DirectoryReader.readDirectoryAsync(path);
    }

    /**
     * Returns whether the file at the given path is a directory.
     *
     * @param path - the path to the file
     *
     * @returns - whether the file is a directory
     */
    public static async IsDirectory(path: string): Promise<boolean> {
        const fileStats = await this.lstatAsync(path);

        return fileStats.isDirectory();
    }
}

export default DirectoryReader;
