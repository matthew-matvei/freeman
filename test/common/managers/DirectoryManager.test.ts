import chai, { expect } from "chai";
import chaiAsPromised from "chai-as-promised";
import fs from "fs";
import path from "path";
import "reflect-metadata";
import Sinon, { SinonSandbox } from "sinon";
import { IMock, It, Mock, Times } from "typemoq";

import DirectoryError from "errors/DirectoryError";
import { DirectoryManager, IAttributesManager, IDirectoryManager } from "managers";
import { IAttributes, IDirectoryItem, IListDirectoryOptions } from "models";
import { IFileSystemWrapper } from "wrappers";

chai.use(chaiAsPromised);

describe("DirectoryManager's", () => {
    let fakeDirPath: string;
    let fakeFolder: string;
    let fakeFolder2: string;
    let inaccessibleFolder: string;
    let fakeFile: string;
    let fakeFile2: string;
    let newFileName: string;
    let newFolderName: string;

    let fileSystemWrapper: IMock<IFileSystemWrapper>;
    let attributesManager: IMock<IAttributesManager>;
    let directoryManager: IDirectoryManager;
    let options: IListDirectoryOptions;

    let testFile: IDirectoryItem;
    let testFile2: IDirectoryItem;
    let testFolder: IDirectoryItem;
    let testFolder2: IDirectoryItem;

    before(() => {
        fakeDirPath = "/path/to/fake/dir";
        fakeFolder = "fakeFolder";
        fakeFolder2 = "fakeFolder2";
        inaccessibleFolder = "inaccessibleFolder";
        fakeFile = "fakeFile.txt";
        fakeFile2 = "fakeFile2.txt";
        newFileName = "newItem.txt";
        newFolderName = "newItem";

        fileSystemWrapper = Mock.ofType<IFileSystemWrapper>();
        attributesManager = Mock.ofType<IAttributesManager>();
        const attributes: IAttributes = {
            hidden: false
        };
        attributesManager.setup(async am => am.getAttributesAsync(It.isAnyString()))
            .returns(Sinon.stub().resolves(attributes));
        directoryManager = new DirectoryManager(fileSystemWrapper.object, attributesManager.object);
        options = {
            hideUnixStyleHiddenItems: false
        };
    });

    beforeEach(() => {
        testFile = {
            accessible: true,
            created: new Date(),
            isDirectory: false,
            isHidden: false,
            lastModified: new Date(),
            name: fakeFile,
            path: path.join(fakeDirPath, fakeFile)
        };

        testFile2 = {
            accessible: true,
            created: new Date(),
            isDirectory: false,
            isHidden: false,
            lastModified: new Date(),
            name: fakeFile2,
            path: path.join(fakeDirPath, fakeFile2)
        };

        testFolder = {
            accessible: true,
            created: new Date(),
            isDirectory: true,
            isHidden: false,
            lastModified: new Date(),
            name: fakeFolder,
            path: path.join(fakeDirPath, fakeFolder)
        };

        testFolder2 = {
            accessible: true,
            created: new Date(),
            isDirectory: true,
            isHidden: false,
            lastModified: new Date(),
            name: fakeFolder2,
            path: path.join(fakeDirPath, fakeFolder2)
        };
    });

    afterEach(() => {
        fileSystemWrapper.reset();
    });

    describe("listDirectory method", () => {
        let sandbox: SinonSandbox;

        before(() => {
            sandbox = Sinon.createSandbox();
        });

        after(() => {
            sandbox.restore();
        });

        it("throws a DirectoryError if given path is not a directory", async () => {
            const nonDirectory = path.join(fakeDirPath, "fakeFile.txt");
            fileSystemWrapper.setup(async fsw => fsw.lstatAsync(It.isAnyString()))
                .returns(async () => ({
                    isDirectory: () => false
                }) as fs.Stats);

            expect(directoryManager.listDirectory(nonDirectory, options)).to.eventually.be.rejectedWith(DirectoryError);
        });

        it("returns an empty list when pointed to empty folder", async () => {
            const emptyFolder = path.join(fakeDirPath, fakeFolder);
            fileSystemWrapper.setup(async fsw => fsw.lstatAsync(It.isAnyString()))
                .returns(async () => ({ isDirectory: () => true }) as fs.Stats);
            fileSystemWrapper.setup(async fsw => fsw.readdirAsync(It.isAnyString())).returns(async () => []);

            const result = await directoryManager.listDirectory(emptyFolder, options);

            expect(result).to.be.empty;
        });

        it("can return a child file of the given path", async () => {
            fileSystemWrapper.setup(async fsw => fsw.readdirAsync(It.isAnyString())).returns(async () => [fakeFile]);
            fileSystemWrapper.setup(async fsw => fsw.lstatAsync(It.isAnyString()))
                .returns(async () => ({ isDirectory: () => true }) as fs.Stats);
            fileSystemWrapper.setup(
                async fsw => fsw.lstatAsync(It.is<string>(pathToStat => pathToStat !== fakeDirPath)))
                .returns(async () => ({
                    isDirectory: () => false,
                    mtime: new Date(),
                    size: 1024
                }) as fs.Stats);

            const result = await directoryManager.listDirectory(fakeDirPath, options);

            expect(result.some(item => item.name === fakeFile &&
                !item.isDirectory)).to.be.true;
        });

        it("can return a child folder of the given path", async () => {
            fileSystemWrapper.setup(async fsw => fsw.readdirAsync(It.isAnyString())).returns(async () => [fakeFolder]);
            fileSystemWrapper.setup(async fsw => fsw.lstatAsync(It.isAnyString()))
                .returns(async () => ({ isDirectory: () => true }) as fs.Stats);
            fileSystemWrapper.setup(
                async fsw => fsw.lstatAsync(It.is<string>(pathToStat => pathToStat !== fakeDirPath)))
                .returns(async () => ({
                    isDirectory: () => true,
                    mtime: new Date()
                }) as fs.Stats);

            const result = await directoryManager.listDirectory(fakeDirPath, options);

            expect(result.some(item => item.name === fakeFolder &&
                item.isDirectory)).to.be.true;
        });

        it("returns false if attributes manager throws getting file attributes", async () => {
            fileSystemWrapper.setup(async fsw => fsw.readdirAsync(It.isAnyString()))
                .returns(async () => [fakeFile, fakeFolder]);
            fileSystemWrapper.setup(async fsw => fsw.lstatAsync(It.isAnyString()))
                .returns(async () => ({ isDirectory: () => true }) as fs.Stats);
            attributesManager.setup(async am => am.getAttributesAsync(It.isAnyString()))
                .returns(sandbox.stub().rejects());

            const result = await directoryManager.listDirectory(fakeDirPath, options);

            expect(result.every(item => !item.isHidden)).to.be.true;
        });

        it("returns a size for a given item if it is not a directory", async () => {
            fileSystemWrapper.setup(async fsw => fsw.readdirAsync(It.isAnyString()))
                .returns(async () => [fakeFile]);
            fileSystemWrapper.setup(async fsw => fsw.lstatAsync(It.isAnyString()))
                .returns(async () => ({ isDirectory: () => true }) as fs.Stats);
            fileSystemWrapper.setup(
                async fsw => fsw.lstatAsync(It.is<string>(pathToStat => pathToStat !== fakeDirPath)))
                .returns(async () => ({
                    isDirectory: () => false,
                    mtime: new Date(),
                    size: 1024
                }) as fs.Stats);

            const result = await directoryManager.listDirectory(fakeDirPath, options);

            expect(result.every(item => (item.isDirectory && item.size === undefined) ||
                (!item.isDirectory && item.size !== undefined))).to.be.true;
        });

        it("returns accessibility for a given item", async () => {
            fileSystemWrapper.setup(async fsw => fsw.readdirAsync(It.isAnyString()))
                .returns(async () => [fakeFolder, inaccessibleFolder]);
            fileSystemWrapper.setup(async fsw => fsw.lstatAsync(It.isAnyString()))
                .returns(async () => ({ isDirectory: () => true }) as fs.Stats);
            fileSystemWrapper.setup(
                async fsw => fsw.lstatAsync(It.is<string>(pathToStat => pathToStat !== fakeDirPath)))
                .returns(async () => ({
                    isDirectory: () => false,
                    mtime: new Date(),
                    size: 1024
                }) as fs.Stats);
            fileSystemWrapper.setup(
                async fsw => fsw.lstatAsync(It.is<string>(pathToStat => pathToStat !== fakeDirPath)))
                .returns(async () => ({
                    isDirectory: () => false,
                    mtime: new Date(),
                    size: 1024
                }) as fs.Stats);
            fileSystemWrapper.setup(async fsw =>
                fsw.accessAsync(
                    It.is<string>(pathToItem => pathToItem.includes(inaccessibleFolder)),
                    fs.constants.R_OK))
                .throws(new Error());

            const result = await directoryManager.listDirectory(fakeDirPath, options);
            const accessibleDirectoryItem = result.find(item => item.name === fakeFolder)!;
            const inaccessibleDirectoryItem = result.find(item => item.name === inaccessibleFolder)!;

            expect(accessibleDirectoryItem.accessible).to.be.true;
            expect(inaccessibleDirectoryItem.accessible).to.be.false;
        });

        it("deems a directory item is an inaccessible folder if lstat errors", async () => {
            fileSystemWrapper.setup(async fsw => fsw.readdirAsync(It.isAnyString()))
                .returns(async () => [fakeFolder, inaccessibleFolder]);
            fileSystemWrapper.setup(async fsw => fsw.lstatAsync(It.isAnyString()))
                .returns(async () => ({ isDirectory: () => true }) as fs.Stats);
            fileSystemWrapper.setup(
                async fsw => fsw.lstatAsync(It.is<string>(pathToStat => pathToStat !== fakeDirPath)))
                .throws(new Error());
            fileSystemWrapper.setup(
                async fsw => fsw.lstatAsync(It.is<string>(pathToStat => pathToStat !== fakeDirPath)))
                .throws(new Error());

            const result = await directoryManager.listDirectory(fakeDirPath, options);

            expect(result.every(item => !item.accessible)).to.be.true;
        });
    });

    describe("createItem method", () => {
        it("can create a file with given name at given path", async () => {
            await directoryManager.createItem(newFileName, fakeDirPath, "file");

            fileSystemWrapper.verify(
                async fsw => fsw.writeFileAsync(
                    It.is<string>(fullPath => fullPath === path.join(fakeDirPath, newFileName)),
                    ""),
                Times.once());
        });

        it("can create a folder with given name at given path", async () => {
            await directoryManager.createItem(newFolderName, fakeDirPath, "folder");

            fileSystemWrapper.verify(
                async fsw => fsw.mkdirAsync(
                    It.is<string>(fullPath => fullPath === path.join(fakeDirPath, newFolderName))
                ), Times.once());
        });

        it("rejects if given an invalid path", () => {
            expect(directoryManager.createItem(newFolderName, "/invalid/path", "file"))
                .to.eventually.be.rejectedWith(DirectoryError);
        });
    });

    describe("renameItem method", () => {
        it("can rename a file", async () => {
            const newName = "renamedFakeFile.txt";

            await directoryManager.renameItem(fakeFile, newName, fakeDirPath);

            fileSystemWrapper.verify(
                async fsw => fsw.renameAsync(
                    It.is<string>(fullOldName => fullOldName === path.join(fakeDirPath, fakeFile)),
                    It.is<string>(fullNewName => fullNewName === path.join(fakeDirPath, newName))), Times.once());

        });

        it("handles renaming to same name", async () => {
            await directoryManager.renameItem(fakeFile, fakeFile, fakeDirPath);

            fileSystemWrapper.verify(async fsw => fsw.renameAsync(It.isAnyString(), It.isAnyString()), Times.never());
        });

        it("rejects if given an invalid path", () => {
            expect(directoryManager.renameItem("invalidFileName.txt", "anyName.txt", fakeDirPath))
                .to.eventually.be.rejectedWith(DirectoryError);
        });
    });

    describe("deleteItems method", () => {
        it("can handle empty list of items", () => {
            expect(directoryManager.deleteItems([])).to.not.eventually.be.rejected;
        });

        it("can delete a file", async () => {
            return directoryManager.deleteItems([testFile]).then(() => {
                try {
                    fs.accessSync(testFile.path);
                } catch (error) {
                    expect(error).to.not.be.null;
                }
            });
        });

        it("can delete a folder", async () => {
            return directoryManager.deleteItems([testFolder]).then(() => {
                try {
                    fs.accessSync(testFolder.path);
                } catch (error) {
                    expect(error).to.not.be.null;
                }
            });
        });

        it("deletes multiple files", async () => {
            return directoryManager.deleteItems([testFile, testFile2]).then(() => {
                try {
                    fs.accessSync(testFile.path);
                    fs.accessSync(testFile2.path);
                } catch (error) {
                    expect(error).to.not.be.null;
                }
            });
        });

        it("deletes multiple folders", async () => {
            return directoryManager.deleteItems([testFolder, testFolder2]).then(() => {
                try {
                    fs.accessSync(testFolder.path);
                    fs.accessSync(testFolder2.path);
                } catch (error) {
                    expect(error).to.not.be.null;
                }
            });
        });

        it("deletes a mix of files and folders", async () => {
            return directoryManager.deleteItems([testFile, testFile2]).then(() => {
                try {
                    fs.accessSync(testFile.path);
                    fs.accessSync(testFile2.path);
                } catch (error) {
                    expect(error).to.not.be.null;
                }
            });
        });

        it("rejects when given an invalid path", () => {
            const invalidFileName = "invalidFileName.txt";
            testFile = {
                accessible: true,
                created: new Date(),
                isDirectory: false,
                isHidden: false,
                lastModified: new Date(),
                name: invalidFileName,
                path: path.join(fakeDirPath, invalidFileName)
            };

            expect(directoryManager.deleteItems([testFile]))
                .to.eventually.be.rejectedWith(DirectoryError);
        });
    });

    describe("moveItems method", () => {
        let destinationFolder: string;

        beforeEach(() => {
            destinationFolder = path.join(fakeDirPath, "fakeFolder");
        });

        it("can handle empty list of items", () => {
            expect(directoryManager.moveItems([], destinationFolder)).to.not.eventually.be.rejected;
        });

        it("moves a file to the given destination", async () => {
            await directoryManager.moveItems([testFile], destinationFolder);

            fileSystemWrapper.verify(
                async fsw => fsw.copyAsync(
                    testFile.path,
                    It.is<string>(destination => destination.includes(destinationFolder))),
                Times.once());
            fileSystemWrapper.verify(async fsw => fsw.unlinkAsync(testFile.path), Times.once());
        });

        it("moves a directory to the given destination", async () => {
            destinationFolder = path.join(fakeDirPath, "anotherFakeFolder");

            await directoryManager.moveItems([testFolder], destinationFolder);

            fileSystemWrapper.verify(
                async fsw => fsw.copyAsync(
                    testFolder.path,
                    It.is<string>(destination => destination.includes(destinationFolder))),
                Times.once());
            fileSystemWrapper.verify(async fsw => fsw.rmdirAsync(testFolder.path), Times.once());
        });

        it("handles moving to the same directory", async () => {
            return directoryManager.moveItems([testFile], fakeDirPath).then(() => {
                try {
                    fs.accessSync(testFile.path);
                } catch (error) {
                    expect(error).to.not.be.null;
                }

                const destinationFileName = path.join(fakeDirPath, fakeFile);

                try {
                    fs.accessSync(destinationFileName);
                } catch (error) {
                    expect(error).to.not.be.null;
                }
            });
        });

        it("moves multiple files", async () => {
            return directoryManager.moveItems([testFile, testFile2], fakeDirPath).then(() => {
                try {
                    fs.accessSync(testFile.path);
                    fs.accessSync(testFile2.path);
                } catch (error) {
                    expect(error).to.not.be.null;
                }
            });
        });

        it("moves multiple folders", async () => {
            return directoryManager.moveItems([testFolder, testFolder2], fakeDirPath).then(() => {
                try {
                    fs.accessSync(testFolder.path);
                    fs.accessSync(testFolder2.path);
                } catch (error) {
                    expect(error).to.not.be.null;
                }
            });
        });

        it("moves a mix of files and folders", async () => {
            return directoryManager.moveItems([testFile, testFolder2], fakeDirPath).then(() => {
                try {
                    fs.accessSync(testFile.path);
                    fs.accessSync(testFolder2.path);
                } catch (error) {
                    expect(error).to.not.be.null;
                }
            });
        });

        it("rejects when given an invalid itemPath", () => {
            const invalidFileName = "invalidFileName.txt";
            testFile = {
                accessible: true,
                created: new Date(),
                isDirectory: false,
                isHidden: false,
                lastModified: new Date(),
                name: invalidFileName,
                path: path.join(fakeDirPath, invalidFileName)
            };

            expect(directoryManager.moveItems([testFile], fakeDirPath))
                .to.eventually.be.rejectedWith(DirectoryError);
        });

        it("rejects when given an invalid destination", () => {
            expect(directoryManager.moveItems([testFile], path.resolve("invalidDirectory")))
                .to.eventually.be.rejectedWith(DirectoryError);
        });
    });
});
