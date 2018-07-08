import { expect } from "chai";
import "reflect-metadata";

import { IDirectoryItem } from "models";
import { DirectorySorter } from "objects";

describe("DirectorySorter's", () => {

    let items: IDirectoryItem[];
    let testItem1: IDirectoryItem;
    let testItem2: IDirectoryItem;
    let testItem3: IDirectoryItem;

    beforeEach(() => {
        items = [];
        testItem1 = {
            accessible: true,
            created: new Date(),
            isDirectory: true,
            isHidden: false,
            lastModified: new Date(),
            name: "test",
            path: "path/to/"
        };
        testItem2 = {
            accessible: true,
            created: new Date(),
            isDirectory: false,
            isHidden: false,
            lastModified: new Date(),
            name: "test.jpg",
            path: "/path/to/"
        };
        testItem3 = {
            accessible: true,
            created: new Date(),
            isDirectory: false,
            isHidden: false,
            lastModified: new Date(),
            name: "another test.jpg",
            path: "/path/to/"
        };
    });

    describe("SortByType method", () => {
        it("returns an empty array when given one", () => {
            const expected: IDirectoryItem[] = [];
            const actual = DirectorySorter.sortByType(items);

            expect(actual).to.deep.equal(expected);
        });

        it("returns the same array when given an array of one", () => {
            items = [testItem1];
            const expected = [testItem1];
            const actual = DirectorySorter.sortByType(items);

            expect(actual).to.deep.equal(expected);
        });

        it("sorts two directory items by type", () => {
            items = [testItem2, testItem1];
            const expected = [testItem1, testItem2];
            const actual = DirectorySorter.sortByType(items);

            expect(actual).to.deep.equal(expected);
        });

        it("sorts three directory items by type", () => {
            items = [testItem3, testItem2, testItem1];
            const expected = [testItem1, testItem2, testItem3];
            const actual = DirectorySorter.sortByType(items);

            expect(actual[0]).to.deep.equal(expected[0]);
        });
    });

    describe("SortByAlphaNumery method", () => {
        it("returns an empty array when given one", () => {
            const expected: IDirectoryItem[] = [];
            const actual = DirectorySorter.sortByAlphaNumery(items);

            expect(actual).to.deep.equal(expected);
        });

        it("returns the same array when given an array of one", () => {
            items = [testItem1];
            const expected = [testItem1];
            const actual = DirectorySorter.sortByAlphaNumery(items);

            expect(actual).to.deep.equal(expected);
        });

        it("sorts two directory items alphabetically", () => {
            items = [testItem2, testItem1];
            const expected = [testItem1, testItem2];
            const actual = DirectorySorter.sortByAlphaNumery(items);

            expect(actual).to.deep.equal(expected);
        });

        it("sorts three directory items alphabetically", () => {
            items = [testItem3, testItem2, testItem1];
            const expected = [testItem3, testItem1, testItem2];
            const actual = DirectorySorter.sortByAlphaNumery(items);

            expect(actual).to.deep.equal(expected);
        });
    });

    describe("SortByTypeThenAlphanumery method", () => {
        it("returns an empty array when given one", () => {
            const expected: IDirectoryItem[] = [];
            const actual = DirectorySorter.sortByTypeThenAlphaNumery(items);

            expect(actual).to.deep.equal(expected);
        });

        it("returns the same array when given an array of one", () => {
            items = [testItem1];
            const expected = [testItem1];
            const actual = DirectorySorter.sortByTypeThenAlphaNumery(items);

            expect(actual).to.deep.equal(expected);
        });

        it("sorts two directory items by type then alphabetically", () => {
            items = [testItem2, testItem1];
            const expected = [testItem1, testItem2];
            const actual = DirectorySorter.sortByTypeThenAlphaNumery(items);

            expect(actual).to.deep.equal(expected);
        });

        it("sorts three directory items by type then alphabetically", () => {
            items = [testItem3, testItem2, testItem1];
            const expected = [testItem1, testItem3, testItem2];
            const actual = DirectorySorter.sortByTypeThenAlphaNumery(items);

            expect(actual).to.deep.equal(expected);
        });
    });
});
