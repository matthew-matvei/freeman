import { expect } from "chai";
import "reflect-metadata";
import sinon from "sinon";

import { IDirectoryItem } from "models";
import { DirectoryTextFinder } from "objects";

describe("DirectoryTextFinder's", () => {
    let clock: sinon.SinonFakeTimers;

    let directoryTextFinder: DirectoryTextFinder;
    let directoryItems: IDirectoryItem[];
    let item1: IDirectoryItem;
    let item2: IDirectoryItem;
    let item3: IDirectoryItem;

    beforeEach(() => {
        clock = sinon.useFakeTimers();

        directoryTextFinder = new DirectoryTextFinder();

        item1 = {
            name: "A item",
            path: "path/to/A item",
            isDirectory: true,
            isHidden: false
        };

        item2 = {
            name: "B item",
            path: "path/to/B item",
            isDirectory: false,
            isHidden: true
        };

        item3 = {
            name: "BA item",
            path: "path/to/BA item",
            isDirectory: false,
            isHidden: true
        };

        directoryItems = [item1, item2, item3];
    });

    afterEach(() => {
        clock.restore();
    });

    describe("addCharAndSearch method", () => {
        it("returns -1 when given empty array", () => {
            const result = directoryTextFinder.addCharAndSearch("a", []);

            expect(result).to.equal(-1);
        });

        it("returns -1 when no items start with given char", () => {
            const result = directoryTextFinder.addCharAndSearch("c", directoryItems);

            expect(result).to.equal(-1);
        });

        it("finds the first item when case matches", () => {
            const result = directoryTextFinder.addCharAndSearch("B", directoryItems);

            expect(result).to.equal(1);
        });

        it("finds the first item when case doesn't match", () => {
            const result = directoryTextFinder.addCharAndSearch("a", directoryItems);

            expect(result).to.equal(0);
        });

        it("adds to the search term after simultaneous calls", () => {
            directoryTextFinder.addCharAndSearch("b", directoryItems);
            const expectedIndex = 2;
            const result = directoryTextFinder.addCharAndSearch("a", directoryItems);

            expect(result).to.equal(expectedIndex);
        });

        it("clears the search term if timeout expired", () => {
            directoryTextFinder.addCharAndSearch("b", directoryItems);
            const excessiveTimeout = 510;
            clock.tick(excessiveTimeout);
            const result = directoryTextFinder.addCharAndSearch("a", directoryItems);

            expect(result).to.equal(0);
        });
    });
});
