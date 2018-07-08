import { expect } from "chai";
import Enzyme, { mount, shallow } from "enzyme";
import ReactSixteenAdapter from "enzyme-adapter-react-16";
import * as React from "react";
import "reflect-metadata";
import Sinon, { SinonSandbox } from "sinon";
import { IMock, It, Mock, Times } from "typemoq";

import { DirectoryItem, InputItem } from "components/blocks";
import { DirectoryList } from "components/panels";
import { IDirectoryManager, ISettingsManager } from "managers";
import {
    IDirectoryItem,
    IHandlers,
    IListDirectoryOptions,
    IStatusNotifier
} from "models";
import { IDirectoryItemProps } from "props/blocks";
import { IDirectoryListProps } from "props/panels";
import { HotKeys, HotKeysProps } from "react-hotkeys";
import applicationTheme from "settings/internal/themes/dark";
import { IDirectoryListState } from "states/panels";
import Utils from "Utils";

Enzyme.configure({ adapter: new ReactSixteenAdapter() });

describe("<DirectoryList />", () => {
    let props: IDirectoryListProps;
    let component: React.ReactElement<IDirectoryListProps>;

    let sandbox: SinonSandbox;

    let mockDirectoryManager: IMock<IDirectoryManager>;
    let mockSettingsManager: IMock<ISettingsManager>;

    let listDirectoryOptions: IListDirectoryOptions;
    let statusNotifier: IStatusNotifier;

    let items: IDirectoryItem[];

    before(() => {
        sandbox = Sinon.createSandbox();

        listDirectoryOptions = {
            hideUnixStyleHiddenItems: true
        };

        mockDirectoryManager = Mock.ofType<IDirectoryManager>();
        mockSettingsManager = Mock.ofType<ISettingsManager>();

        statusNotifier = {
            notify: () => { },
            setChosenCount: () => { },
            setItemCount: () => { }
        };

        items = [
            {
                accessible: true,
                created: new Date(),
                isDirectory: false,
                isHidden: false,
                lastModified: new Date(),
                name: "item1.txt",
                path: "/path/to/item1.txt"
            },
            {
                accessible: true,
                created: new Date(),
                isDirectory: false,
                isHidden: false,
                lastModified: new Date(),
                name: "item2.txt",
                path: "/path/to/item2.txt"
            }
        ];
    });

    beforeEach(() => {
        mockDirectoryManager.reset();
        mockDirectoryManager.setup(async dm => dm.listDirectory(It.isAnyString(), It.isAny()))
            .returns(sandbox.stub().resolves());

        props = {
            columnSizes: {
                createdOn: 0,
                lastModified: 25,
                name: 50,
                size: 25
            },
            directoryManager: mockDirectoryManager.object,
            id: "left",
            isSelectedPane: true,
            path: "/path/to",
            sendPathUp: (path: string) => { },
            sendSelectedPaneUp: () => { },
            settingsManager: mockSettingsManager.object,
            statusNotifier,
            theme: applicationTheme
        };

        component = <DirectoryList {...props} />;
    });

    after(() => {
        sandbox.restore();
    });

    it("renders a <div /> with className 'DirectoryList'", () => {
        const wrapper = shallow(component);

        expect(wrapper.findWhere(n => n.type() === "div" && n.hasClass("DirectoryList")));
    });

    it("begins with no 'directoryItems'", () => {
        const wrapper = shallow(component);
        const state = wrapper.state() as IDirectoryListState;

        expect(state.directoryItems).to.be.empty;
    });

    it("begins with no 'chosenItems'", () => {
        const wrapper = shallow(component);
        const state = wrapper.state() as IDirectoryListState;

        expect(state.chosenItems).to.be.empty;
    });

    it("begins with 'selectedIndex' of 0", () => {
        const wrapper = shallow(component);
        const state = wrapper.state() as IDirectoryListState;

        expect(state.selectedIndex).to.equal(0);
    });

    it("begins with 'showHiddenItems' as false", () => {
        const wrapper = shallow(component);
        const state = wrapper.state() as IDirectoryListState;

        expect(state.showHiddenItems).to.be.false;
    });

    it("begins with 'creatingNewItem' as false", () => {
        const wrapper = shallow(component);
        const state = wrapper.state() as IDirectoryListState;

        expect(state.showHiddenItems).to.be.false;
    });

    it("begins with 'renamingItem' as false", () => {
        const wrapper = shallow(component);
        const state = wrapper.state() as IDirectoryListState;

        expect(state.renamingItem).to.be.false;
    });

    it("begins with 'itemDeleted' as false", () => {
        const wrapper = shallow(component);
        const state = wrapper.state() as IDirectoryListState;

        expect(state.itemDeleted).to.be.false;
    });

    it("begins with 'isGotoOpen' as false", () => {
        const wrapper = shallow(component);
        const state = wrapper.state() as IDirectoryListState;

        expect(state.isGotoOpen).to.be.false;
    });

    it("updates 'directoryItems' after mounting", async () => {
        const wrapper = shallow(component);

        return mockDirectoryManager.object.listDirectory("/path/to", listDirectoryOptions).then(() => {
            const state = wrapper.state() as IDirectoryListState;

            expect(state.directoryItems).to.be.empty;
        });
    });

    it("starts watching the directory on mount", () => {
        shallow(component);

        mockDirectoryManager.verify(dm => dm.startWatching(props.path, It.isAny()), Times.once());
    });

    it("watches the selected directory on update of path", () => {
        const wrapper = shallow(component);
        wrapper.setProps({ path: "/path/to/new" } as IDirectoryListProps);

        mockDirectoryManager.verify(dm => dm.startWatching(It.isAnyString(), It.isAny()), Times.exactly(2));
    });

    it("stops watching the directory on unmount", () => {
        const wrapper = shallow(component);
        wrapper.unmount();

        mockDirectoryManager.verify(dm => dm.stopWatching(), Times.once());
    });

    it("focuses the component when 'isSelectedPane' becomes set", () => {
        props.isSelectedPane = false;
        component = <DirectoryList {...props} />;
        const wrapper = shallow(component);
        wrapper.setProps({ isSelectedPane: true } as IDirectoryListProps);
        const state = wrapper.state() as IDirectoryListState;

        expect(state.isFocused).to.be.true;
    });

    it("renders an input item if renaming a selected item", () => {
        const wrapper = shallow(component);
        wrapper.setState({ directoryItems: items } as IDirectoryListState);
        wrapper.setState({ renamingItem: true } as IDirectoryListState);

        expect(wrapper.find(InputItem)).to.have.length(1);
    });

    it("focus sets 'isFocused'", () => {
        props.isSelectedPane = false;
        component = <DirectoryList {...props} />;
        const wrapper = shallow(component);
        const hotkeys = wrapper.find(HotKeys);
        const hotkeysProps = hotkeys.props() as HotKeysProps;
        const preState = wrapper.state() as IDirectoryListState;
        expect(preState.isFocused).to.be.false;
        hotkeysProps.onFocus!();
        const postState = wrapper.state() as IDirectoryListState;

        expect(postState.isFocused).to.be.true;
    });

    it("focus clears 'isFocused'", () => {
        const wrapper = shallow(component);
        const hotkeys = wrapper.find(HotKeys);
        const hotkeysProps = hotkeys.props() as HotKeysProps;
        const preState = wrapper.state() as IDirectoryListState;
        expect(preState.isFocused).to.be.true;
        hotkeysProps.onBlur!();
        const postState = wrapper.state() as IDirectoryListState;

        expect(postState.isFocused).to.be.false;
    });

    it("renders input item when 'creatingNewItem' set", () => {
        const wrapper = shallow(component);
        wrapper.setState({ directoryItems: items } as IDirectoryListState);
        wrapper.setState({ creatingNewItem: "file" } as IDirectoryListState);

        expect(wrapper.find(InputItem)).to.have.length(1);
    });

    it("scrolls to top when navigating back", () => {
        const scrollTopStub = sandbox.stub();
        const context: any = { scrollArea: { scrollTop: scrollTopStub } };
        const wrapper = shallow(component, { context });
        const hotkeys = wrapper.find(HotKeys);
        const hotkeysProps = hotkeys.props() as HotKeysProps;
        expect(hotkeysProps.handlers).to.exist;
        (hotkeysProps.handlers as IHandlers).moveBack();

        expect(scrollTopStub.calledOnce).to.be.true;
    });

    it("scrolls to top when navigating into a directory", () => {
        const scrollTopStub = sandbox.stub();
        const context: any = { scrollArea: { scrollTop: scrollTopStub } };
        const wrapper = shallow(component, { context });
        wrapper.setState({ directoryItems: items } as IDirectoryListState);
        const directoryItem = wrapper.find(DirectoryItem).first();
        const directoryItemProps = directoryItem.props() as IDirectoryItemProps;
        directoryItemProps.sendPathUp("/path/to/dir");

        expect(scrollTopStub.calledOnce).to.be.true;
    });

    it("focusses keys trapper only if pane is focussed", () => {
        const wrapper = mount(component);
        const focusSpy = sandbox.spy(Utils, "autoFocus");
        wrapper.setState({ isFocused: false } as IDirectoryListState);
        expect(focusSpy.calledOnce).to.be.false;

        wrapper.setState({ isFocused: true } as IDirectoryListState);
        expect(focusSpy.calledOnce).to.be.true;
    });
});
