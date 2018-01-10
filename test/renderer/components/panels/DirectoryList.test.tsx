import "reflect-metadata";
import * as React from "react";
import { expect } from "chai";
import Enzyme, { shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import sinon, { SinonSandbox } from "sinon";
import mockfs from "mock-fs";

import { DirectoryList } from "components/panels";
import { IDirectoryListProps } from "props/panels";
import { IDirectoryListState } from "states/panels";
import { IDirectoryManager } from "objects/managers";
import { IStatusNotifier } from "models";

Enzyme.configure({ adapter: new Adapter() });

describe("<DirectoryList />", () => {
    let props: IDirectoryListProps;
    let component: React.ReactElement<IDirectoryListProps>;

    let sandbox: SinonSandbox;

    let directoryManager: IDirectoryManager;

    before(() => {
        sandbox = sinon.createSandbox();

        mockfs({
            "/path/to": {
                "fakeFolder": {},
                "fakeFile.txt": "With fake news"
            }
        });

        directoryManager = {} as IDirectoryManager;
        directoryManager.listDirectory = sandbox.stub().resolves();

        const statusNotifier = {} as IStatusNotifier;

        props = {
            id: "left",
            isSelectedPane: true,
            path: "/path/to",
            sendPathUp: (path: string) => { },
            sendSelectedPaneUp: () => { },
            directoryManager,
            statusNotifier
        };
    });

    beforeEach(() => {
        component = <DirectoryList {...props} />;
    });

    after(() => {
        sandbox.restore();
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

    it("updates 'directoryItems' after mounting", () => {
        const wrapper = shallow(component);
        directoryManager.listDirectory("/path/to").then(() => {
            const state = wrapper.state() as IDirectoryListState;

            expect(state.directoryItems).to.be.empty;
        });
    });
});
