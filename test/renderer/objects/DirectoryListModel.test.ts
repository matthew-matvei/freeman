import "reflect-metadata";
import { expect } from "chai";

import { DirectoryListModel } from "objects";
import { IDirectoryListState } from "states/panels";
import { IDirectoryListProps } from "props/panels";
import { DirectoryPaneSide } from "types";
import { IDirectoryItem, INavigationNode, IStatusNotifier } from "models";
import { IDirectoryManager } from "managers";

describe("DirectoryListModel's", () => {
    let directoryListModel: DirectoryListModel;
    let directoryItem1: IDirectoryItem;

    let directoryManager: IDirectoryManager;

    before(() => {
        directoryListModel = new DirectoryListModel();
    });

    beforeEach(() => {
        directoryItem1 = {
            name: "Item 1",
            path: "path/to/Item 1",
            isDirectory: false,
            isHidden: false
        };
    });

    describe("stateChanged method", () => {
        let prevState: IDirectoryListState;
        let nextState: IDirectoryListState;

        beforeEach(() => {
            const commonState: IDirectoryListState = {
                creatingNewItem: false,
                itemDeleted: false,
                renamingItem: false,
                selectedIndex: 0,
                showHiddenItems: false,
                isGotoOpen: false,
                directoryItems: [],
                chosenItems: [],
                isFocused: false
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

        const statusNotifier = {} as IStatusNotifier;

        beforeEach(() => {
            const commonProps: IDirectoryListProps = {
                id: "left",
                isSelectedPane: false,
                path: "/path/to/directory",
                sendPathUp: (path: string) => { },
                sendSelectedPaneUp: (paneToSelect: DirectoryPaneSide) => { },
                directoryManager,
                statusNotifier
            }

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

    describe("popCachedNavigation method", () => {
        let pathToCache: string;

        let nodeToCache: INavigationNode;

        before(() => {
            pathToCache = "path/to/cache";
        });

        beforeEach(() => {
            nodeToCache = {
                path: "path/to/cache",
                directoryItems: [],
                selectedIndex: 0
            };
        });

        it("returns undefined if navigationStack is empty", () => {
            const result = directoryListModel.popCachedNavigation(pathToCache);

            expect(result).to.be.undefined;
        });

        it("returns undefined if the top node's path is different", () => {
            nodeToCache.path = "path/to/differentCache";
            directoryListModel.cacheNavigation(nodeToCache);
            const result = directoryListModel.popCachedNavigation(pathToCache);

            expect(result).to.be.undefined;
        });

        it("returns navigation node if top node's path is same", () => {
            directoryListModel.cacheNavigation(nodeToCache);
            const result = directoryListModel.popCachedNavigation(pathToCache);

            expect(result).to.deep.equal(nodeToCache);
        });
    });
});
