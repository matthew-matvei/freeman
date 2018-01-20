import chai, { expect } from "chai";
import chaiAsPromised from "chai-as-promised";
import fs from "fs";
import mockfs from "mock-fs";
import path from "path";
import "reflect-metadata";
import sinon, { SinonSandbox } from "sinon";
import { Mock } from "typemoq";

import DirectoryError from "errors/DirectoryError";
import { DirectoryManager, IDirectoryManager, ISettingsManager } from "managers";
import { IDirectoryItem } from "models";
import Utils from "Utils";

chai.use(chaiAsPromised);

describe("directoryManager's", () => {
    let fakeDirPath: string;
    let fakeFolder: string;
    let fakeFolder2: string;
    let fakeFile: string;
    let fakeFile2: string;
    let newFileName: string;
    let newFolderName: string;

    let directoryManager: IDirectoryManager;

    let testFile: IDirectoryItem;
    let testFile2: IDirectoryItem;
    let testFolder: IDirectoryItem;
    let testFolder2: IDirectoryItem;

    before(() => {
        fakeDirPath = "/path/to/fake/dir";
        fakeFolder = "fakeFolder";
        fakeFolder2 = "fakeFolder2";
        fakeFile = "fakeFile.txt";
        fakeFile2 = "fakeFile2.txt";
        newFileName = "newItem.txt";
        newFolderName = "newItem";

        const settings: any = {
            windows: {
                hideUnixStyleHiddenItems: false
            }
        };

        const settingsManager = Mock.ofType<ISettingsManager>();
        settingsManager.setup(sm => sm.settings).returns(() => settings);
        directoryManager = new DirectoryManager(settingsManager.object);
    });

    beforeEach(() => {
        mockfs({
            "/path/to/fake/dir": {
                fakeFolder: {},
                fakeFolder2: {},
                anotherFakeFolder: {},
                "fakeFile.txt": "With fake news",
                "fakeFile2.txt": "And fake media"
            }
        });

        testFile = {
            path: path.join(fakeDirPath, fakeFile),
            name: fakeFile,
            isDirectory: false,
            isHidden: false
        };

        testFile2 = {
            path: path.join(fakeDirPath, fakeFile2),
            name: fakeFile2,
            isDirectory: false,
            isHidden: false
        };

        testFolder = {
            path: path.join(fakeDirPath, fakeFolder),
            name: fakeFolder,
            isDirectory: true,
            isHidden: false
        };

        testFolder2 = {
            path: path.join(fakeDirPath, fakeFolder2),
            name: fakeFolder2,
            isDirectory: true,
            isHidden: false
        };
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
        it("can create a file with given name at given path", async () => {
            return directoryManager.createItem(newFileName, fakeDirPath, "file").then(resolved => {
                const newFile = fs.lstatSync(path.resolve(fakeDirPath, newFileName));

                expect(newFile.isFile()).to.be.true;
            });
        });

        it("can create a folder with given name at given path", async () => {
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
        it("can rename a file", async () => {
            const newName = "renamedFakeFile.txt";

            return directoryManager.renameItem(fakeFile, newName, fakeDirPath).then(resolved => {
                const renamedFile = fs.lstatSync(path.join(fakeDirPath, newName));

                expect(renamedFile).to.not.be.undefined;
            });
        });

        it("can rename a folder", async () => {
            const newName = "renamedFakeFolder";

            return directoryManager.renameItem(fakeFolder, newName, fakeDirPath).then(resolved => {
                const renamedFolder = fs.lstatSync(path.join(fakeDirPath, newName));

                expect(renamedFolder).to.not.be.undefined;
            });
        });

        it("handles renaming to same name", async () => {
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
                path: path.join(fakeDirPath, invalidFileName),
                name: invalidFileName,
                isDirectory: false,
                isHidden: false
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
            return directoryManager.moveItems([testFile], destinationFolder).then(() => {
                try {
                    fs.accessSync(testFile.path);
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

        it("moves a directory to the given destination", async () => {
            destinationFolder = path.join(fakeDirPath, "anotherFakeFolder");

            return directoryManager.moveItems([testFolder], destinationFolder).then(() => {
                try {
                    fs.accessSync(testFolder.path);
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
                path: path.join(fakeDirPath, invalidFileName),
                name: invalidFileName,
                isDirectory: false,
                isHidden: false
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
