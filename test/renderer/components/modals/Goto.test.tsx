import { expect } from "chai";
import Enzyme, { mount, shallow } from "enzyme";
import ReactSixteenAdapter from "enzyme-adapter-react-16";
import path from "path";
import * as React from "react";
import "reflect-metadata";
import Sinon, { SinonSandbox, SinonSpy } from "sinon";
import { IMock, It, Mock } from "typemoq";

import { Goto, QuickSelect } from "components/modals";
import { IDirectoryManager, ISettingsManager } from "managers";
import { IDirectoryItem } from "models";
import { IGotoProps, IQuickSelectProps } from "props/modals";
import applicationSettings from "settings/internal/settings";
import applicationTheme from "settings/internal/themes/dark";
import { IGotoState } from "states/modals";

Enzyme.configure({ adapter: new ReactSixteenAdapter() });

describe("<Goto />", () => {
    let props: IGotoProps;
    let component: React.ReactElement<IGotoProps>;

    let renderSpy: SinonSpy;
    let sandbox: SinonSandbox;

    let item1: IDirectoryItem;
    let item2: IDirectoryItem;
    let inaccessibleItem: IDirectoryItem;

    let directoryManager: IMock<IDirectoryManager>;
    let settingsManager: IMock<ISettingsManager>;

    before(() => {
        sandbox = Sinon.createSandbox();

        item1 = {
            accessible: true,
            created: new Date(),
            isDirectory: true,
            isHidden: false,
            lastModified: new Date(),
            name: "Item 1",
            path: "/path/to/Item 1"
        };

        item2 = {
            accessible: true,
            created: new Date(),
            isDirectory: true,
            isHidden: false,
            lastModified: new Date(),
            name: "Item 2",
            path: "/path/to/Item 2"
        };

        inaccessibleItem = {
            accessible: false,
            created: new Date(),
            isDirectory: true,
            isHidden: false,
            lastModified: new Date(),
            name: "Inaccessible",
            path: "/path/to/Inaccessible"
        };

        directoryManager = Mock.ofType<IDirectoryManager>();
        directoryManager.setup(async dm => dm.listDirectory(It.isAnyString(), It.isAny()))
            .returns(sandbox.stub().resolves([item1, item2, inaccessibleItem]));

        settingsManager = Mock.ofType<ISettingsManager>();
        settingsManager.setup(sm => sm.settings).returns(() => applicationSettings);

        props = {
            directoryManager: directoryManager.object,
            initialPath: "/path/to/initial",
            isOpen: false,
            navigateTo: () => { },
            onClose: () => { },
            settingsManager: settingsManager.object,
            theme: applicationTheme
        };
    });

    beforeEach(() => {
        component = <Goto {...props} />;
    });

    afterEach(() => {
        renderSpy && renderSpy.restore();
    });

    after(() => {
        sandbox.restore();
    });

    it("begins with 'searchTerm' equal to 'initialPath'", () => {
        const wrapper = shallow(component);
        const state = wrapper.state() as IGotoState;

        expect(state.searchTerm).to.equal(props.initialPath);
    });

    it("begins with 'currentDirectory' equal to 'initialPath'", () => {
        const wrapper = shallow(component);
        const state = wrapper.state() as IGotoState;

        expect(state.currentDirectory).to.equal(props.initialPath);
    });

    it("begins with empty 'directoryItems'", () => {
        const wrapper = shallow(component);
        const state = wrapper.state() as IGotoState;

        expect(state.directoryItems).to.be.empty;
    });

    it("updates 'items' in state after mounting", async () => {
        const wrapper = shallow(component);

        return directoryManager.object.listDirectory("/path/to", {} as any)
            .then(() => {
                const state = wrapper.state() as IGotoState;

                expect(state.directoryItems).to.deep.equal([item1, item2, inaccessibleItem]);
            });
    });

    it("first item in the QuickSelect is the current directory", () => {
        const wrapper = mount(component);
        const state = wrapper.state() as IGotoState;
        const quickSelect = wrapper.findWhere(n => n.name() === "QuickSelect");
        const quickSelectProps = quickSelect.instance().props as IQuickSelectProps;

        expect(quickSelectProps.initialItems[0].props.value).to.equal(state.currentDirectory);
    });

    it("updating 'items' re-renders the component once", async () => {
        shallow(component);
        renderSpy = Sinon.spy(Goto.prototype, "render");

        return directoryManager.object.listDirectory("/path/to", {} as any)
            .then(() => {
                expect(renderSpy.callCount).to.equal(1);
            });
    });

    it("clears 'quickSelectValue' on update", () => {
        const wrapper = shallow(component);
        wrapper.setState({ quickSelectValue: "some value" });
        const state = wrapper.state() as IGotoState;

        expect(state.quickSelectValue).to.be.undefined;
    });

    it("does not navigate into a directory if it is inaccessible", () => {
        const wrapper = shallow(component);
        wrapper.setState({ searchTerm: inaccessibleItem.path });
        const quickSelect = wrapper.find(QuickSelect);
        const quickSelectProps = quickSelect.props() as IQuickSelectProps;
        const { currentDirectory } = wrapper.state() as IGotoState;

        quickSelectProps.onKeyUp!({ key: path.sep } as any);

        expect((wrapper.state() as IGotoState).currentDirectory).to.equal(currentDirectory);
    });

    it("does not handle selecting an item if it is not accessible", async () => {
        const wrapper = shallow(component);
        wrapper.setState({ searchTerm: inaccessibleItem.path }, async () => {
            const quickSelect = wrapper.find(QuickSelect);
            const quickSelectProps = quickSelect.props() as IQuickSelectProps;
            const { currentDirectory } = wrapper.state() as IGotoState;
            quickSelectProps.onSelect(inaccessibleItem.path);

            expect((wrapper.state() as IGotoState).currentDirectory).to.equal(currentDirectory);
        });
    });
});
