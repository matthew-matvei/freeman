import "reflect-metadata";
import { IMock, Mock, Times } from "typemoq";

import { ISettingsManager } from "managers";
import { ICommonSettings } from "models/settings";
import { IntegratedTerminal, IShell } from "objects";
import applicationSettings from "settings/internal/settings";

describe("IntegratedTerminal's", () => {

    let useFallbackShell: boolean;
    let settingsManager: IMock<ISettingsManager>;
    let shell: IMock<IShell>;
    const userLinuxShell = "/some/custom/shell";
    const userWindowsShell = "CustomShell.exe";
    const originalPlatform = process.platform;
    let userSettings: ICommonSettings;

    before(() => {
        userSettings = JSON.parse(JSON.stringify(applicationSettings));
        userSettings.linux.shell = userLinuxShell;
        userSettings.windows.shell = userWindowsShell;
        settingsManager = Mock.ofType<ISettingsManager>();
        settingsManager.setup(sm => sm.settings).returns(() => userSettings);
    });

    beforeEach(() => {
        useFallbackShell = false;
        shell = Mock.ofType<IShell>();
    });

    afterEach(() => {
        Object.defineProperty(process, "platform", { value: originalPlatform });
    });

    describe("constructor", () => {
        it("attempts to use configured shell when 'useFallbackShell' is false on Linux", () => {
            Object.defineProperty(process, "platform", { value: "linux" });

            new IntegratedTerminal(settingsManager.object, shell.object, useFallbackShell);

            shell.verify(sh => sh.spawn(userLinuxShell), Times.once());
        });

        it("attempts to use configured shell when 'useFallbackShell' is false on Windows", () => {
            Object.defineProperty(process, "platform", { value: "win32" });

            new IntegratedTerminal(settingsManager.object, shell.object, useFallbackShell);

            shell.verify(sh => sh.spawn(userWindowsShell), Times.once());
        });

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
