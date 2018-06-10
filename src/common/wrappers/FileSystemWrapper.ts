import fs from "fs";
import { injectable } from "inversify";
import ncp from "ncp";
import { promisify } from "util";

import IFileSystemWrapper from "./IFileSystemWrapper";

/** Provides a wrapper for file system operations. */
@injectable()
class FileSystemWrapper implements IFileSystemWrapper {

    /** @inheritDoc */
    public readonly lstatAsync = promisify(fs.lstat);

    /** @inheritDoc */
    public readonly rmdirAsync = promisify(fs.rmdir);

    /** @inheritDoc */
    public readonly unlinkAsync = promisify(fs.unlink);

    /** @inheritDoc */
    public readonly renameAsync = promisify(fs.rename);

    /** @inheritDoc */
    public readonly mkdirAsync = promisify(fs.mkdir);

    /** @inheritDoc */
    public readonly copyAsync = promisify(ncp.ncp);

    /** @inheritDoc */
    public readonly writeFileAsync = promisify(fs.writeFile);

    /** @inheritDoc */
    public readonly accessAsync = promisify(fs.access);

    /** @inheritDoc */
    public readonly readdirAsync = promisify(fs.readdir);
}

export default FileSystemWrapper;
