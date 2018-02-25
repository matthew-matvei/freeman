
import "reflect-metadata";

describe("Navigator's", () => {
    describe("constructor", () => {
        it("retrieves the child items");

        it("retrieves the descendents of every child folder");

        it("retrieves the siblings if the parent directory can be accessed");
    });

    describe("toParent method", () => {
        it("throws a LoggedError if the parent directory path is null");

        it("uses cache to serve new child items");

        it("does not need to retrieve new grandchildren");

        it("retrieves parent directory path's items if not null");
    });

    describe("toChild method", () => {
        it("yields a no op if 'currentDirectoryItems' is falsey");

        it("throws a LoggedError if the descendents of the child item have not begun retrieval");

        it("only needs to retrieve the grandchildren of the child item");
    });

    describe("toDirectory method", () => {
        it("calls the toParent method if given path is parent path");

        it("calls the toChild method if the given path is a child path");

        it("retrieves the child items");

        it("retrieves the descendents of every child folder");

        it("retrieves the siblings if the parent directory can be accessed");
    });

    describe("retrieveDirectoryItems method", () => {
        it("returns 'currentDirectoryItems' if already instantiated");

        it("retrieves the child items");

        it("retrieves the descendents of every child folder");
    });
});
