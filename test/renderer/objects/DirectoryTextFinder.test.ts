import { expect } from "chai";
import "reflect-metadata";
import Sinon from "sinon";

import { IDirectoryItem } from "models";
import { DirectoryTextFinder } from "objects";

describe("DirectoryTextFinder's", () => {
    let clock: Sinon.SinonFakeTimers;

    let directoryTextFinder: DirectoryTextFinder;
    let directoryItems: IDirectoryItem[];
    let item1: IDirectoryItem;
    let item2: IDirectoryItem;
    let item3: IDirectoryItem;
    let item4: IDirectoryItem;

    beforeEach(() => {
        clock = Sinon.useFakeTimers();

        directoryTextFinder = new DirectoryTextFinder();

        item1 = {
            isDirectory: true,
            isHidden: false,
            lastModified: new Date(),
            name: "A item",
            path: "path/to/A item"
        };

        item2 = {
            isDirectory: false,
            isHidden: true,
            lastModified: new Date(),
            name: "B item",
            path: "path/to/B item"
        };

        item3 = {
            isDirectory: false,
            isHidden: true,
            lastModified: new Date(),
            name: "BA item",
            path: "path/to/BA item"
        };

        item4 = {
            isDirectory: false,
            isHidden: false,
            lastModified: new Date(),
            name: "B-A item",
            path: "path/to/B-A item"
        };

        directoryItems = [item1, item2, item3, item4];
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
            const result = directoryTextFinder.addCharAndSearch("a", directoryItems);

            expect(result).to.equal(2);
        });

        it("clears the search term if timeout expired", () => {
            directoryTextFinder.addCharAndSearch("b", directoryItems);
            const excessiveTimeout = 510;
            clock.tick(excessiveTimeout);
            const result = directoryTextFinder.addCharAndSearch("a", directoryItems);

            expect(result).to.equal(0);
        });

        it("handles non-alphanumeric characters", () => {
            directoryTextFinder.addCharAndSearch("b", directoryItems);
            const result = directoryTextFinder.addCharAndSearch("-", directoryItems);

            expect(result).to.equal(3);
        });
    });
});
