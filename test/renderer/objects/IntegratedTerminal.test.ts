import "reflect-metadata";

describe("IntegratedTerminal's", () => {
    describe("constructor", () => {
        it("attempts to use configured shell when 'useFallbackShell' is false");

        it("uses fallback shell when 'useFallbackShell' is true");

        it("uses cursor blinking if configured to in settings");
    });

    describe("shell getter", () => {
        it("gets the configured shell when 'useFallbackShell' is false");

        it("gets the fallback shell if 'useFallbackShell' is true");
    });

    describe("fitTo method", () => {
        it("adjusts the rows and columns of the underlying terminal process");
    });

    describe("changeDirectory method", () => {
        it("begins with a 'cd' command");

        it("contains the directory to change to, surrounded by single quotes");

        it("ends with a os.EOL character to commit the command");
    });
});
