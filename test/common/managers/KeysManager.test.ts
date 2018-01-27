import { expect } from "chai";
import "reflect-metadata";
import { IMock, It, Mock } from "typemoq";

import { IDirectoryManager, IKeysManager, KeysManager } from "managers";
import { IKeyMap } from "models";
import applicationKeys from "settings/internal/keys";

describe("KeysManager's", () => {
    let directoryManagerMock: IMock<IDirectoryManager>;
    let keysManager: IKeysManager;

    let userKeys: IKeyMap;

    beforeEach(() => {
        directoryManagerMock = Mock.ofType<IDirectoryManager>();
        keysManager = new KeysManager(directoryManagerMock.object);

        userKeys = JSON.parse(JSON.stringify(applicationKeys));
    });

    describe("keyMap getter", () => {
        it("gets application-level settings", () => {
            const result = keysManager.keyMap;

            expect(result).to.deep.equal(applicationKeys);
        });

        it("gets a mix of application and user settings", () => {
            const someKey = "b";
            userKeys.moveUp = [someKey];
            directoryManagerMock.setup(dm => dm.readFileSync(It.isAnyString()))
                .returns(() => JSON.stringify(userKeys));

            const result = keysManager.keyMap;

            expect(result.moveUp).to.deep.equal([someKey]);
            expect(result.moveDown).to.deep.equal(applicationKeys.moveDown);
        });

        it("overwrites application settings with user settings", () => {
            const userKey = "b";
            userKeys.moveUp = [userKey];
            expect(userKeys.moveUp).to.not.deep.equal(applicationKeys.moveUp);
            directoryManagerMock.setup(dm => dm.readFileSync(It.isAnyString()))
                .returns(() => JSON.stringify(userKeys));

            const result = keysManager.keyMap;

            expect(result.moveUp).to.deep.equal([userKey]);
            expect(result.moveUp).to.not.deep.equal(applicationKeys.moveUp);
        });
    });
});
