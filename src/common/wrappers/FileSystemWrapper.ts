import fs from "fs";
import { injectable } from "inversify";
import ncp from "ncp";
import { promisify } from "util";

import IFileSystemWrapper from "./IFileSystemWrapper";

@injectable()
class FileSystemWrapper implements IFileSystemWrapper {

    public lstatAsync = promisify(fs.lstat);
    public rmdirAsync = promisify(fs.rmdir);
    public unlinkAsync = promisify(fs.unlink);
    public renameAsync = promisify(fs.rename);
    public mkdirAsync = promisify(fs.mkdir);
    public copyAsync = promisify(ncp.ncp);
    public writeFileAsync = promisify(fs.writeFile);
    public accessAsync = promisify(fs.access);
    public readdirAsync = promisify(fs.readdir);
}

export default FileSystemWrapper;
