import "reflect-metadata";
import fs from "fs";
import path from "path";
import chai, { expect } from "chai";
import chaiAsPromised from "chai-as-promised";
import mockfs from "mock-fs";
import sinon, { SinonSandbox } from "sinon";

import { DirectoryManager, IDirectoryManager } from "objects/managers";
import DirectoryError from "errors/DirectoryError";
import Utils from "Utils";

chai.use(chaiAsPromised);

describe("directoryManager's", () => {
    let fakeDirPath: string;
    let fakeFolder: string;
    let fakeFile: string;
    let newFileName: string;
    let newFolderName: string;

    let directoryManager: IDirectoryManager;

    before(() => {
        fakeDirPath = "/path/to/fake/dir";
        fakeFolder = "fakeFolder";
        fakeFile = "fakeFile.txt";
        newFileName = "newItem.txt";
        newFolderName = "newItem";

        directoryManager = new DirectoryManager();
    });

    beforeEach(() => {
        mockfs({
            "/path/to/fake/dir": {
                "fakeFolder": {},
                "anotherFakeFolder": {},
                "fakeFile.txt": "With fake news"
            }
        });
    });

    afterEach(mockfs.restore);

    describe("listDirectory method", () => {
        let sandbox: SinonSandbox;

        before(() => {
            sandbox = sinon.createSandbox();

            sandbox.stub(Utils, "getAsync").resolves(false);
        });

        after(() => {
            sandbox.restore();
        });

        it("throws a DirectoryError if given path is not a directory", async () => {
            const nonDirectory = path.join(fakeDirPath, "fakeFile.txt");

            expect(directoryManager.listDirectory(nonDirectory)).to.eventually.be.rejectedWith(DirectoryError);
        });

        it("returns an empty list when pointed to empty folder", async () => {
            const emptyFolder = path.join(fakeDirPath, fakeFolder);
            const result = await directoryManager.listDirectory(emptyFolder);

            expect(result).to.be.empty;
        });

        it("can return a child file of the given path", async () => {
            const result = await directoryManager.listDirectory(fakeDirPath);

            expect(result.some(item => item.name === "fakeFile.txt" &&
                !item.isDirectory));
        });

        it("can return a child folder of the given path", async () => {
            const result = await directoryManager.listDirectory(fakeDirPath);

            expect(result.some(item => item.name === fakeFolder &&
                item.isDirectory));
        });
    });

    describe("createItem method", () => {
        it("can create a file with given name at given path", () => {
            return directoryManager.createItem(newFileName, fakeDirPath, "file").then(resolved => {
                const newFile = fs.lstatSync(path.resolve(fakeDirPath, newFileName));

                expect(newFile.isFile()).to.be.true;
            });
        });

        it("can create a folder with given name at given path", () => {
            return directoryManager.createItem(newFolderName, fakeDirPath, "folder").then(resolved => {
                const newFolder = fs.lstatSync(path.resolve(fakeDirPath, newFolderName));

                expect(newFolder.isDirectory()).to.be.true;
            });
        });

        it("rejects if given an invalid path", () => {
            expect(directoryManager.createItem(newFolderName, "/invalid/path", "file"))
                .to.eventually.be.rejectedWith(DirectoryError);
        });
    });

    describe("renameItem method", () => {
        it("can rename a file", () => {
            const newName = "renamedFakeFile.txt";
            return directoryManager.renameItem(fakeFile, newName, fakeDirPath).then(resolved => {
                const renamedFile = fs.lstatSync(path.join(fakeDirPath, newName));

                expect(renamedFile).to.not.be.undefined;
            });
        });

        it("can rename a folder", () => {
            const newName = "renamedFakeFolder";

            return directoryManager.renameItem(fakeFolder, newName, fakeDirPath).then(resolved => {
                const renamedFolder = fs.lstatSync(path.join(fakeDirPath, newName));

                expect(renamedFolder).to.not.be.undefined;
            });
        });

        it("handles renaming to same name", () => {
            return directoryManager.renameItem(fakeFile, fakeFile, fakeDirPath)
                .then(() => {
                    const oldNamedFile = fs.lstatSync(path.join(fakeDirPath, fakeFile));
                    const newNamedFile = fs.lstatSync(path.join(fakeDirPath, fakeFile));

                    expect(newNamedFile).to.deep.equal(oldNamedFile);
                });
        });

        it("rejects if given an invalid path", () => {
            expect(directoryManager.renameItem("invalidFileName.txt", "anyName.txt", fakeDirPath))
                .to.eventually.be.rejectedWith(DirectoryError);
        });
    });

    describe("deleteItem method", () => {
        let fileToDelete: string;
        let folderToDelete: string;

        beforeEach(() => {
            fileToDelete = path.join(fakeDirPath, fakeFile);
            folderToDelete = path.join(fakeDirPath, fakeFolder);
        });

        it("can delete a file", () => {
            return directoryManager.deleteItem(fileToDelete, "file").then(() => {
                try {
                    fs.accessSync(fileToDelete);
                } catch (error) {
                    expect(error).to.not.be.null;
                }
            });
        });

        it("can delete a folder", () => {
            return directoryManager.deleteItem(folderToDelete, "folder").then(() => {
                try {
                    fs.accessSync(folderToDelete);
                } catch (error) {
                    expect(error).to.not.be.null;
                }
            });
        });

        it("rejects when given an invalid path", () => {
            fileToDelete = path.join(fakeDirPath, "invalidFileName.txt");

            expect(directoryManager.deleteItem(fileToDelete, "file"))
                .to.eventually.be.rejectedWith(DirectoryError);
        });
    });

    describe("moveItem method", () => {
        let fileToMove: string;
        let folderToMove: string;

        before(() => {
            fileToMove = path.join(fakeDirPath, fakeFile);
            folderToMove = path.join(fakeDirPath, fakeFolder);
        });

        it("moves a file to the given destination", () => {
            const destinationFolder = path.join(fakeDirPath, "fakeFolder");
            return directoryManager.moveItem(fileToMove, destinationFolder, "file").then(() => {
                try {
                    fs.accessSync(fileToMove);
                } catch (error) {
                    expect(error).to.not.be.null;
                }

                const destinationFileName = path.join(destinationFolder, "fakeFile.txt");

                try {
                    fs.accessSync(destinationFileName);
                } catch (error) {
                    expect(error).to.be.null;
                }
            });
        });

        it("moves a directory to the given destination", () => {
            const destinationFolder = path.join(fakeDirPath, "anotherFakeFolder");
            return directoryManager.moveItem(folderToMove, destinationFolder, "folder").then(() => {
                try {
                    fs.accessSync(folderToMove);
                } catch (error) {
                    expect(error).to.not.be.null;
                }

                const destinationFolderName = path.join(destinationFolder, fakeFolder);
                try {
                    fs.accessSync(destinationFolderName);
                } catch (error) {
                    expect(error).to.be.null;
                }
            });
        });

        it("handles moving to the same directory", () => {
            return directoryManager.moveItem(fileToMove, fakeDirPath, "file").then(() => {
                try {
                    fs.accessSync(fileToMove);
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

        it("rejects when given an invalid itemPath", () => {
            const fileToMove = path.join(fakeDirPath, "invalidFileName.txt");

            expect(directoryManager.moveItem(fileToMove, fakeDirPath, "file"))
                .to.eventually.be.rejectedWith(DirectoryError);
        });

        it("rejects when given an invalid destination", () => {
            const fileToMove = path.join(fakeDirPath, fakeFile);

            expect(directoryManager.moveItem(fileToMove, path.resolve("invalidDirectory"), "file"))
                .to.eventually.be.rejectedWith(DirectoryError);
        });
    });
});
