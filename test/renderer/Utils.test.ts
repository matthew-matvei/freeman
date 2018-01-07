import "reflect-metadata";
import path from "path";
import { expect } from "chai";

import Utils from "Utils";

describe("isAlphanumeric function", () => {
    it("returns true on 'a'", () => {
        expect(Utils.isAlphanumeric('a')).to.be.true;
    });

    it("returns true on 'A'", () => {
        expect(Utils.isAlphanumeric('A')).to.be.true;
    });

    it("returns true on 'ab'", () => {
        expect(Utils.isAlphanumeric('ab')).to.be.true;
    });

    it("returns true on '1'", () => {
        expect(Utils.isAlphanumeric('1')).to.be.true;
    });

    it("returns true on '10'", () => {
        expect(Utils.isAlphanumeric('10')).to.be.true;
    });

    it("returns true on '1a'", () => {
        expect(Utils.isAlphanumeric('1a')).to.be.true;
    });

    it("returns true on 'a1'", () => {
        expect(Utils.isAlphanumeric('a1')).to.be.true;
    });

    it("returns false on '.'", () => {
        expect(Utils.isAlphanumeric('.')).to.be.false;
    });

    it("returns false on ' '", () => {
        expect(Utils.isAlphanumeric(' ')).to.be.false;
    });
});

describe("fuzzySearchItems function", () => {
    let items: string[];
    let item1: string;
    let item2: string;
    let item3: string;
    let item4: string;
    let item5: string;

    beforeEach(() => {
        item1 = "/path/to/aeg";
        item2 = "/path/to/cgb";
        item3 = "/path/to/gst";
        item4 = "/path/to/bgz";
        item5 = "/path/to/abc" + path.sep; // used for testing system-dependent separator
        items = [item1, item2, item3, item4, item5];
    });

    it("returns given items when given empty search term", () => {
        const result = Utils.fuzzySearchItems("", items);

        expect(result).to.deep.equal(items);
    });

    it("returns given items when search term ends with '/' or '\\'", () => {
        const result = Utils.fuzzySearchItems(item5, items);

        expect(result).to.deep.equal(items);
    });

    it("returns given items when items is an empty list", () => {
        const expected: string[] = [];
        const result = Utils.fuzzySearchItems("a", expected);

        expect(result).to.deep.equal(expected);
    });

    it("returns items containing matching letters in search term", () => {
        const expected = [item1, item5];
        const result = Utils.fuzzySearchItems("a", items);

        expect(result).to.deep.equal(expected);
    });

    it("is not case sensitive", () => {
        const expected = [item2];
        const result = Utils.fuzzySearchItems("Cg", items);

        expect(result).to.deep.equal(expected);
    });

    it("searches according to order of letters in search term", () => {
        const expected = [item2];
        const result = Utils.fuzzySearchItems("gb", items);

        expect(result).to.deep.equal(expected);
    });
});
