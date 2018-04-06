import { expect } from "chai";
import os from "os";
import "reflect-metadata";
import { IMock, It, Mock, Times } from "typemoq";

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
    const newDirectory = "/path/to/directory";
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

        it("uses fallback shell when 'useFallbackShell' is true on Linux", () => {
            Object.defineProperty(process, "platform", { value: "linux" });
            useFallbackShell = true;
            new IntegratedTerminal(settingsManager.object, shell.object, useFallbackShell);

            shell.verify(sh => sh.spawn(applicationSettings.linux.shell), Times.once());
        });

        it("uses fallback shell when 'useFallbackShell' is true on Windows", () => {
            Object.defineProperty(process, "platform", { value: "win32" });
            useFallbackShell = true;
            new IntegratedTerminal(settingsManager.object, shell.object, useFallbackShell);

            shell.verify(sh => sh.spawn(applicationSettings.windows.shell), Times.once());
        });

        it("attaches to a constructed Xterm terminal", () => {
            new IntegratedTerminal(settingsManager.object, shell.object, useFallbackShell);

            shell.verify(sh => sh.attach(It.isAny()), Times.once());
        });
    });

    describe("shellName getter", () => {
        it("gets the configured shell when 'useFallbackShell' is false", () => {
            Object.defineProperty(process, "platform", { value: "linux" });
            const terminal = new IntegratedTerminal(settingsManager.object, shell.object, useFallbackShell);

            expect(terminal.shellName).to.equal(userLinuxShell);
        });

        it("gets the fallback shell if 'useFallbackShell' is true", () => {
            Object.defineProperty(process, "platform", { value: "linux" });
            useFallbackShell = true;
            const terminal = new IntegratedTerminal(settingsManager.object, shell.object, useFallbackShell);

            expect(terminal.shellName).to.equal(applicationSettings.linux.shell);
        });
    });

    describe("fitTo method", () => {
        it("adjusts the rows and columns of the underlying terminal process");
    });

    describe("changeDirectory method", () => {
        it("begins with a 'cd' command", () => {
            const terminal = new IntegratedTerminal(settingsManager.object, shell.object, useFallbackShell);
            terminal.changeDirectory(newDirectory);

            shell.verify(sh => sh.write(It.is<string>(command => command.startsWith("cd "))), Times.once());
        });

        it("contains the directory to change to, surrounded by single quotes", () => {
            const expected = `'${newDirectory}'`;
            const terminal = new IntegratedTerminal(settingsManager.object, shell.object, useFallbackShell);
            terminal.changeDirectory(newDirectory);

            shell.verify(sh => sh.write(It.is<string>(command => command.includes(expected))), Times.once());
        });

        it("ends with a os.EOL character to commit the command", () => {
            const terminal = new IntegratedTerminal(settingsManager.object, shell.object, useFallbackShell);
            terminal.changeDirectory(newDirectory);

            shell.verify(sh => sh.write(It.is<string>(command => command.endsWith(os.EOL))), Times.once());
        });
    });
});
