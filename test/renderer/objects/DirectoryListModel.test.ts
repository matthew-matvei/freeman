import { expect } from "chai";
import "reflect-metadata";
import { IMock, Mock } from "typemoq";

import { IDirectoryManager, ISettingsManager } from "managers";
import { IDirectoryItem, IStatusNotifier } from "models";
import { DirectoryListModel } from "objects";
import { IDirectoryListProps } from "props/panels";
import applicationTheme from "settings/internal/themes/dark";
import { IDirectoryListState } from "states/panels";
import { DirectoryPaneSide } from "types";

describe("DirectoryListModel's", () => {
    let directoryListModel: DirectoryListModel;
    let directoryItem1: IDirectoryItem;

    let settingsManager: IMock<ISettingsManager>;

    before(() => {
        directoryListModel = new DirectoryListModel();
        settingsManager = Mock.ofType<ISettingsManager>();
    });

    beforeEach(() => {
        directoryItem1 = {
            isDirectory: false,
            isHidden: false,
            lastModified: new Date(),
            name: "Item 1",
            path: "path/to/Item 1"
        };
    });

    describe("stateChanged method", () => {
        let prevState: IDirectoryListState;
        let nextState: IDirectoryListState;

        beforeEach(() => {
            const commonState: IDirectoryListState = {
                chosenItems: [],
                creatingNewItem: false,
                directoryItems: [],
                isFocused: false,
                isGotoOpen: false,
                itemDeleted: false,
                renamingItem: false,
                selectedIndex: 0,
                showHiddenItems: false
            };

            prevState = { ...commonState };
            nextState = { ...commonState };
        });

        it("Returns false when nothing has changed", () => {
            expect(directoryListModel.stateChanged(prevState, nextState))
                .to.be.false;
        });

        it("detects changes in 'creatingNewItem'", () => {
            nextState.creatingNewItem = "file";

            expect(directoryListModel.stateChanged(prevState, nextState))
                .to.be.true;
        });

        it("detects changes in 'itemDeleted'", () => {
            nextState.itemDeleted = true;

            expect(directoryListModel.stateChanged(prevState, nextState))
                .to.be.true;
        });

        it("detects changes in 'renamingItem'", () => {
            nextState.renamingItem = true;

            expect(directoryListModel.stateChanged(prevState, nextState))
                .to.be.true;
        });

        it("detects changes in 'selectedIndex'", () => {
            nextState.selectedIndex = 1;

            expect(directoryListModel.stateChanged(prevState, nextState))
                .to.be.true;
        });

        it("detects changes in 'showHiddenItems'", () => {
            nextState.showHiddenItems = true;

            expect(directoryListModel.stateChanged(prevState, nextState))
                .to.be.true;
        });

        it("detects changes in 'isGotoOpen'", () => {
            nextState.isGotoOpen = true;

            expect(directoryListModel.stateChanged(prevState, nextState))
                .to.be.true;
        });
    });

    describe("propsChanged method", () => {
        let prevProps: IDirectoryListProps;
        let nextProps: IDirectoryListProps;

        let directoryManager: IMock<IDirectoryManager>;

        const statusNotifier = {} as IStatusNotifier;

        beforeEach(() => {
            directoryManager = Mock.ofType<IDirectoryManager>();

            const commonProps: IDirectoryListProps = {
                directoryManager: directoryManager.object,
                id: "left",
                isSelectedPane: false,
                path: "/path/to/directory",
                sendPathUp: (path: string) => { },
                sendSelectedPaneUp: (paneToSelect: DirectoryPaneSide) => { },
                settingsManager: settingsManager.object,
                statusNotifier,
                theme: applicationTheme
            };

            prevProps = { ...commonProps };
            nextProps = { ...commonProps };
        });

        it("returns false when nothing has changed", () => {
            const result = directoryListModel.propsChanged(prevProps, nextProps);

            expect(result).to.be.false;
        });

        it("detects changes in 'isSelectedPane'", () => {
            nextProps.isSelectedPane = true;
            const result = directoryListModel.propsChanged(prevProps, nextProps);

            expect(result).to.be.true;
        });
    });

    describe("chosenItemsChanged method", () => {
        let prevItems: IDirectoryItem[];
        let nextItems: IDirectoryItem[];

        beforeEach(() => {
            const commonItems: IDirectoryItem[] = [directoryItem1];

            prevItems = [...commonItems];
            nextItems = [...commonItems];
        });

        it("returns false when nothing has changed", () => {
            const result = directoryListModel.chosenItemsChanged(prevItems, nextItems);

            expect(result).to.be.false;
        });

        it("detects when a chosen item has been added or removed", () => {
            nextItems.shift();
            const result = directoryListModel.chosenItemsChanged(prevItems, nextItems);

            expect(result).to.be.true;
        });
    });

    describe("directoryItemsChanged method", () => {
        let prevItems: IDirectoryItem[];
        let nextItems: IDirectoryItem[];

        beforeEach(() => {
            const commonItems: IDirectoryItem[] = [directoryItem1];

            prevItems = commonItems;
            nextItems = commonItems;
        });

        it("returns false when nothing has changed", () => {
            const result = directoryListModel.directoryItemsChanged(prevItems, nextItems);

            expect(result).to.be.false;
        });

        it("detects when an item has been added or removed", () => {
            nextItems = [];
            const result = directoryListModel.directoryItemsChanged(prevItems, nextItems);

            expect(result).to.be.true;
        });

        it("detects when an item's name has changed", () => {
            const changedItem: IDirectoryItem = { ...directoryItem1 };
            changedItem.name = "Different name";
            nextItems = [changedItem];

            const result = directoryListModel.directoryItemsChanged(prevItems, nextItems);

            expect(result).to.be.true;
        });
    });
});
