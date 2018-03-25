import { expect } from "chai";

import { ArgumentsParser } from "arguments";

describe("ArgumentsParser's", () => {
    describe("parse function", () => {

        it("parses '--verbose' flag successfully", () => {
            const args = ["--verbose"];
            const result = ArgumentsParser.parse(args);

            expect(result.verbose).to.be.true;
        });

        it("parses '-V' flag successfully", () => {
            const args = ["-V"];
            const result = ArgumentsParser.parse(args);

            expect(result.verbose).to.be.true;
        });

        it("parses '--version' flag successfully", () => {
            const args = ["--version"];
            const result = ArgumentsParser.parse(args);

            expect(result.version).to.be.true;
        });

        it("parses '-v' flag successfully", () => {
            const args = ["-v"];
            const result = ArgumentsParser.parse(args);

            expect(result.version).to.be.true;
        });
    });
});
