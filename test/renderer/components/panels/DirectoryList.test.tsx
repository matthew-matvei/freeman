import * as React from "react";
import { expect } from "chai";
import Enzyme, { shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import sinon, { SinonSpy } from "sinon";
import mockfs from "mock-fs";

import { DirectoryList } from "components/panels";
import { IDirectoryListProps } from "props/panels";
import { IDirectoryListState } from "states/panels";
import { DirectoryManager } from "objects/managers";
import { DirectoryManagerFake } from "fakes";

Enzyme.configure({ adapter: new Adapter() });

describe("<DirectoryList />", () => {
    let props: IDirectoryListProps;
    let component: React.ReactElement<IDirectoryListProps>;
    let closeWatchSpy: SinonSpy;

    before(() => {
        mockfs({
            "path/to": {
                "fakeFolder": {},
                "fakeFile.txt": "With fake news"
            }
        });

        sinon.stub(DirectoryManager, "listDirectory")
            .callsFake(DirectoryManagerFake.listDirectory);

        props = {
            id: "left",
            isSelectedPane: true,
            path: "/path/to",
            sendPathUp: (path: string) => { },
            sendSelectedPaneUp: () => { }
        };
    });

    beforeEach(() => {
        component = <DirectoryList {...props} />;
    });

    afterEach(() => {
        closeWatchSpy && closeWatchSpy.restore();
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
        DirectoryManager.listDirectory("/path/to")
            .then(() => {
                const state = wrapper.state() as IDirectoryListState;

                expect(state.directoryItems).to.be.empty;
            });
    });
});
