import fs from "fs";
import { injectable } from "inversify";
import ncp from "ncp";
import { promisify } from "util";

import IFileSystemWrapper from "./IFileSystemWrapper";

@injectable()
class FileSystemWrapper implements IFileSystemWrapper {

    public readonly lstatAsync = promisify(fs.lstat);
    public readonly rmdirAsync = promisify(fs.rmdir);
    public readonly unlinkAsync = promisify(fs.unlink);
    public readonly renameAsync = promisify(fs.rename);
    public readonly mkdirAsync = promisify(fs.mkdir);
    public readonly copyAsync = promisify(ncp.ncp);
    public readonly writeFileAsync = promisify(fs.writeFile);
    public readonly accessAsync = promisify(fs.access);
    public readonly readdirAsync = promisify(fs.readdir);
}

export default FileSystemWrapper;
