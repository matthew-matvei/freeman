import { expect } from "chai";
import "reflect-metadata";
import { IMock, It, Mock } from "typemoq";

import { IDirectoryManager, ISettingsManager, SettingsManager } from "managers";
import { ICommonSettings } from "models/settings";
import applicationSettings from "settings/internal/settings";

describe("SettingsManager's", () => {
    let directoryManagerMock: IMock<IDirectoryManager>;
    let settingsManager: ISettingsManager;

    let userSettings: ICommonSettings;

    beforeEach(() => {
        directoryManagerMock = Mock.ofType<IDirectoryManager>();
        settingsManager = new SettingsManager(directoryManagerMock.object);
        userSettings = JSON.parse(JSON.stringify(applicationSettings));
    });

    describe("settings getter", () => {
        it("gets application-level settings", () => {
            const result = settingsManager.settings;

            expect(result).to.deep.equal(applicationSettings);
        });

        it("gets a mix of application and user settings", () => {
            const someShell = "/some/shell";
            userSettings.linux.shell = someShell;
            directoryManagerMock.setup(dm => dm.readFileSync(It.isAnyString()))
                .returns(() => JSON.stringify(userSettings));

            const result = settingsManager.settings;

            expect(result.linux.shell).to.equal(someShell);
            expect(result.windows.shell).to.equal(applicationSettings.windows.shell);
        });

        it("overwrites application settings with user settings", () => {
            const userShell = "/usr/shell";
            userSettings.linux.shell = userShell;
            expect(userSettings.linux.shell).to.not.equal(applicationSettings.linux.shell);
            directoryManagerMock.setup(dm => dm.readFileSync(It.isAnyString()))
                .returns(() => JSON.stringify(userSettings));

            const result = settingsManager.settings;

            expect(result.linux.shell).to.equal(userShell);
            expect(result.linux.shell).to.not.equal(applicationSettings.linux.shell);
        });

        it("deeply merges settings together", () => {
            const userShell = "cmd.exe";
            const minimalSettings: ICommonSettings = {
                windows: {
                    shell: userShell
                }
            } as any;

            directoryManagerMock.setup(dm => dm.readFileSync(It.isAnyString()))
                .returns(() => JSON.stringify(minimalSettings));

            const result = settingsManager.settings;

            expect(result.windows.shell).to.equal(userShell);
            expect(result.windows.hideUnixStyleHiddenItems).to.not.be.undefined;
            expect(result.windows.hideUnixStyleHiddenItems)
                .to.equal(applicationSettings.windows.hideUnixStyleHiddenItems);
        });
    });
});
