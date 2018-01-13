import "reflect-metadata";
import * as React from "react";
import * as PropTypes from "prop-types";
import { expect } from "chai";
import Enzyme, { mount, shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import sinon, { SinonSandbox, SinonSpy } from "sinon";

import applicationTheme from "settings/internal/themes/dark";
import { Goto } from "components/modals";
import { IGotoProps, IQuickSelectProps } from "props/modals";
import { IGotoState } from "states/modals";
import { IDirectoryItem, IAppContext } from "models";
import { IDirectoryManager } from "managers";

Enzyme.configure({ adapter: new Adapter() });

describe("<Goto />", () => {
    let context: IAppContext;
    let props: IGotoProps;
    let component: React.ReactElement<IGotoProps>;

    let renderSpy: SinonSpy;
    let sandbox: SinonSandbox;

    let item1: IDirectoryItem;
    let item2: IDirectoryItem;

    let directoryManager: IDirectoryManager;

    before(() => {
        sandbox = sinon.createSandbox();

        context = {
            theme: applicationTheme
        }
        item1 = {
            name: "Item 1",
            path: "/path/to/Item 1",
            isDirectory: true,
            isHidden: false
        };

        item2 = {
            name: "Item 2",
            path: "/path/to/Item 2",
            isDirectory: true,
            isHidden: false
        };

        directoryManager = {} as IDirectoryManager;
        directoryManager.listDirectory = sandbox.stub().resolves([item1, item2]);

        props = {
            isOpen: false,
            onClose: () => { },
            initialPath: "/path/to/initial",
            navigateTo: () => { },
            directoryManager
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

    it("updates 'items' in state after mounting", () => {
        const wrapper = shallow(component);
        return directoryManager.listDirectory("/path/to")
            .then(() => {
                const state = wrapper.state() as IGotoState;

                expect(state.directoryItems).to.deep.equal([item1, item2]);
            });
    });

    it("first item in the QuickSelect is the current directory", () => {
        const wrapper = mount(component, {
            context, childContextTypes: {
                theme: PropTypes.object
            }
        });
        const state = wrapper.state() as IGotoState;
        const quickSelect = wrapper.findWhere(n => n.name() === "QuickSelect");
        const quickSelectProps = quickSelect.instance().props as IQuickSelectProps;

        expect(quickSelectProps.initialItems[0]).to.equal(state.currentDirectory);
    });

    it("updating 'items' re-renders the component once", () => {
        shallow(component);
        renderSpy = sinon.spy(Goto.prototype, "render");
        return directoryManager.listDirectory("/path/to")
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
});
