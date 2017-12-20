import fs from "fs";
import path from "path";
import { expect } from "chai";
import mockfs from "mock-fs";

import { DirectoryManager } from "objects/managers";

describe("DirectoryManager's", () => {
    let fakeDirPath: string;
    let fakeFolder: string;
    let fakeFile: string;
    let newFileName: string;
    let newFolderName: string;

    before(() => {
        fakeDirPath = "path/to/fake/dir";
        fakeFolder = "fakeFolder";
        fakeFile = "fakeFile.txt";
        newFileName = "newItem.txt";
        newFolderName = "newItem";
    });

    beforeEach(() => {
        mockfs({
            "path/to/fake/dir": {
                "fakeFolder": {},
                "fakeFile.txt": "With fake news"
            }
        });
    });

    afterEach(() => {
        mockfs.restore();
    })

    describe("listDirectory method", () => {
        it("returns an empty array if given path is not a directory", async () => {
            const nonDirectory = path.join(fakeDirPath, "fakeFile.txt");
            const result = await DirectoryManager.listDirectory(nonDirectory);

            expect(result).to.be.empty;
        });

        it("returns an empty list when pointed to empty folder", async () => {
            const emptyFolder = path.join(fakeDirPath, fakeFolder);
            const result = await DirectoryManager.listDirectory(emptyFolder);

            expect(result).to.be.empty;
        });

        it("can return a child file of the given path", async () => {
            const result = await DirectoryManager.listDirectory(fakeDirPath);

            expect(result.some(item => item.name === "fakeFile.txt" &&
                !item.isDirectory));
        });

        it("can return a child folder of the given path", async () => {
            const result = await DirectoryManager.listDirectory(fakeDirPath);

            expect(result.some(item => item.name === fakeFolder &&
                item.isDirectory));
        });
    });

    describe("createItem method", () => {
        it("can create a file with given name at given path", async () => {
            await DirectoryManager.createItem(newFileName, fakeDirPath, "file");

            const newFile = fs.lstatSync(path.resolve(fakeDirPath, newFileName));

            expect(newFile.isFile()).to.be.true;
        });

        it("can create a folder with given name at given path", async () => {
            await DirectoryManager.createItem(newFolderName, fakeDirPath, "folder");

            const newFolder = fs.lstatSync(path.resolve(fakeDirPath, newFolderName));

            expect(newFolder.isDirectory()).to.be.true;
        });

        it("rejects if given an invalid path", async () => {
            try {
                await DirectoryManager.createItem(newFolderName, "/invalid/path", "file");
            }
            catch (error) {
                expect(error).to.not.be.null;
            };
        });
    });

    describe("renameItem method", () => {
        it("can rename a file", async () => {
            const newName = "renamedFakeFile.txt";
            await DirectoryManager.renameItem(fakeFile, newName, fakeDirPath);

            const renamedFile = fs.lstatSync(path.join(fakeDirPath, newName));

            expect(renamedFile).to.not.be.undefined;
        });

        it("can rename a folder", async () => {
            const newName = "renamedFakeFolder";

            await DirectoryManager.renameItem(fakeFolder, newName, fakeDirPath);

            const renamedFolder = fs.lstatSync(path.join(fakeDirPath, newName));

            expect(renamedFolder).to.not.be.undefined;
        });

        it("handles renaming to same name", () => {
            DirectoryManager.renameItem(fakeFile, fakeFile, fakeDirPath)
                .then(() => {
                    const oldNamedFile = fs.lstatSync(path.join(fakeDirPath, fakeFile));
                    const newNamedFile = fs.lstatSync(path.join(fakeDirPath, fakeFile));

                    expect(newNamedFile).to.not.deep.equal(oldNamedFile);
                });
        });

        it("rejects if given an invalid path", async () => {
            try {
                await DirectoryManager.renameItem("invalidFileName.txt", "anyName.txt", fakeDirPath);
            }
            catch (error) {
                expect(error).to.not.be.null;
            }
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
            DirectoryManager.deleteItem(fileToDelete, "file").then(() => {
                const deletedFile = fs.lstatSync(fileToDelete);

                expect(deletedFile).to.be.undefined;
            });
        });

        it("can delete a folder", () => {
            DirectoryManager.deleteItem(folderToDelete, "folder").then(() => {
                const deletedFolder = fs.lstatSync(folderToDelete);

                expect(deletedFolder).to.be.undefined;
            });
        });

        it("rejects when given an invalid path", async () => {
            fileToDelete = path.join(fakeDirPath, "invalidFileName.txt");

            try {
                await DirectoryManager.deleteItem(fileToDelete, "file");
            }
            catch (error) {
                expect(error).to.not.be.null;
            }
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
            DirectoryManager.moveItem(fileToMove, path.resolve("fakeDirectory")).then(() => {
                const sourceFile = fs.lstatSync(fileToMove);
                const destinationFileName = path.join(fakeDirPath, "fakeDirectory", "fakeFile.txt");
                const destinationFile = fs.lstatSync(destinationFileName);

                expect(sourceFile).to.be.undefined;
                expect(destinationFile).to.not.be.undefined;
            });
        });

        it("moves a directory to the given destination", () => {
            DirectoryManager.moveItem(folderToMove, path.resolve("fakeDirectory")).then(() => {
                const sourceFolder = fs.lstatSync(folderToMove);
                const destinationFolderName = path.join(fakeDirPath, "fakeDirectory", fakeFolder);
                const destinationFolder = fs.lstatSync(destinationFolderName);

                expect(sourceFolder).to.be.undefined;
                expect(destinationFolder).to.not.be.undefined;
            });
        });

        it("handles moving to the same directory", () => {
            DirectoryManager.moveItem(fileToMove, path.resolve(fakeDirPath)).then(() => {
                const sourceFile = fs.lstatSync(fileToMove);
                const destinationFileName = path.join(fakeDirPath, fakeFile);
                const destinationFile = fs.lstatSync(destinationFileName);

                expect(sourceFile).to.deep.equal(destinationFile);
            });
        });

        it("rejects when given an invalid itemPath", async () => {
            const fileToMove = path.join(fakeDirPath, "invalidFileName.txt");

            try {
                await DirectoryManager.moveItem(fileToMove, path.resolve(fakeDirPath))
            } catch (error) {
                expect(error).to.not.be.null;
            }
        });

        it("rejects when given an invalid destination", async () => {
            const fileToMove = path.join(fakeDirPath, fakeFile);

            try {
                await DirectoryManager.moveItem(fileToMove, path.resolve("invalidDirectory"));
            } catch (error) {
                expect(error).to.not.be.null;
            }
        });
    });
});
