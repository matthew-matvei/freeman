import { expect } from "chai";
import "reflect-metadata";
import Sinon, { SinonSandbox } from "sinon";
import { IMock, It, Mock } from "typemoq";

import {
    IDirectoryManager,
    ISettingsManager,
    IThemesManager,
    ThemesManager
} from "managers";
import { ITheme } from "models";
import applicationTheme from "settings/internal/themes/dark";

describe("ThemesManager's", () => {
    let settingsManagerMock: IMock<ISettingsManager>;
    let directoryManagerMock: IMock<IDirectoryManager>;
    let themeManager: IThemesManager;

    let userTheme: ITheme;
    let sandbox: SinonSandbox;

    beforeEach(() => {
        settingsManagerMock = Mock.ofType<ISettingsManager>();
        directoryManagerMock = Mock.ofType<IDirectoryManager>();
        themeManager = new ThemesManager(settingsManagerMock.object, directoryManagerMock.object);

        userTheme = JSON.parse(JSON.stringify(applicationTheme));

        sandbox = Sinon.createSandbox();
    });

    afterEach(() => {
        sandbox && sandbox.restore();
    });

    describe("theme getter", () => {

        it("gets application-level settings", () => {
            const result = themeManager.theme;

            expect(result).to.deep.equal(applicationTheme);
        });

        it("gets a mix of application and user settings", () => {
            const someColour = "some colour";
            userTheme.directoryItem.backgroundColour = someColour;
            directoryManagerMock.setup(dm => dm.readFileSync(It.isAnyString()))
                .returns(() => JSON.stringify(userTheme));

            const result = themeManager.theme;

            expect(result.directoryItem.backgroundColour).to.equal(someColour);
            expect(result.directoryItem.fileColour).to.equal(applicationTheme.directoryItem.fileColour);
        });

        it("overwrites application settings with user settings", () => {
            const userColour = "user colour";
            userTheme.directoryItem.backgroundColour = userColour;
            expect(userTheme.directoryItem.backgroundColour)
                .to.not.equal(applicationTheme.directoryItem.backgroundColour);
            directoryManagerMock.setup(dm => dm.readFileSync(It.isAnyString()))
                .returns(() => JSON.stringify(userTheme));

            const result = themeManager.theme;

            expect(result.directoryItem.backgroundColour).to.equal(userColour);
            expect(result.directoryItem.backgroundColour).to.not.equal(applicationTheme.directoryItem.backgroundColour);
        });

        it("deeply merges theme settings together", () => {
            const userColour = "user colour";
            const minimalTheme: ITheme = {
                directoryItem: {
                    backgroundColour: userColour
                }
            } as any;
            directoryManagerMock.setup(dm => dm.readFileSync(It.isAnyString()))
                .returns(() => JSON.stringify(minimalTheme));

            const result = themeManager.theme;

            expect(result.directoryItem.backgroundColour).to.equal(userColour);
            expect(result.directoryItem.selectedBackgroundColour).to.not.be.undefined;
            expect(result.directoryItem.selectedBackgroundColour)
                .to.equal(applicationTheme.directoryItem.selectedBackgroundColour);
        });
    });
});
