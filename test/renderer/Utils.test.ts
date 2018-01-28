import chai, { expect } from "chai";
import chaiAsPromised from "chai-as-promised";
import os from "os";
import path from "path";
import "reflect-metadata";
import sinon, { SinonSandbox } from "sinon";
import winattr, { Attributes } from "winattr";

import Utils from "Utils";

chai.use(chaiAsPromised);

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
        item5 = `/path/to/abc${path.sep}`; // used for testing system-dependent separator
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

describe("tryParseJSON function", () => {
    it("returns false when given empty string", () => {
        const result = Utils.tryParseJSON("");

        expect(result).to.be.false;
    });

    it("returns false when given non JSON-encoded string", () => {
        const result = Utils.tryParseJSON("Non-JSON string");

        expect(result).to.be.false;
    });

    it("returns false when string describes non-object", () => {
        const someFunction = () => { };
        const result = Utils.tryParseJSON(JSON.stringify(someFunction));

        expect(result).to.be.false;
    });

    it("return parsed object when string is JSON-encoded object", () => {
        const someObject = { someKey: "value" };
        const result = Utils.tryParseJSON(JSON.stringify(someObject));

        expect(result).to.deep.equal(someObject);
    });
});

describe("isHidden function", () => {
    let sandbox: SinonSandbox;

    before(() => {
        sandbox = sinon.createSandbox();
    });

    afterEach(() => {
        sandbox && sandbox.restore();
    });

    it("throws a ReferenceError if given empty pathToItem", () => {
        expect(Utils.isHidden("", false)).to.eventually.be
            .rejectedWith(ReferenceError);
    });

    it("returns true using linux and item starting with '.'", () => {
        sandbox.stub(os, "platform").returns("linux");
        const result = Utils.isHidden("/path/to/.item", false);

        expect(result).to.eventually.be.true;
    });

    it("returns false using linux and items not starting with '.'", () => {
        sandbox.stub(os, "platform").returns("linux");
        const result = Utils.isHidden("/path/to/item", false);

        expect(result).to.eventually.be.true;
    });

    it("returns true using windows, hideUnixStyleHiddenItems and item starting with '.'", () => {
        sandbox.stub(os, "platform").returns("win32");
        const result = Utils.isHidden("/path/to/.item", true);

        expect(result).to.eventually.be.true;
    });

    it("returns true using windows and item's attributes.hidden is set", () => {
        sandbox.stub(os, "platform").returns("win32");
        sandbox.stub(winattr, "get").returns(() => ({ hidden: true } as Attributes));
        const result = Utils.isHidden("/path/to/hiddenItem", false);

        expect(result).to.eventually.be.true;
    });

    it("returns true using windows, hideUnixStyleHiddenItems and item's attributes.hidden is set", () => {
        sandbox.stub(os, "platform").returns("win32");
        sandbox.stub(winattr, "get").returns(() => ({ hidden: true } as Attributes));
        const result = Utils.isHidden("/path/to/hiddenItem", true);

        expect(result).to.eventually.be.true;
    });

    it("returns false using windows and item's attributes.hidden is cleared", () => {
        sandbox.stub(os, "platform").returns("win32");
        const result = Utils.isHidden("/path/to/.item", false);

        expect(result).to.eventually.be.false;
    });
});
