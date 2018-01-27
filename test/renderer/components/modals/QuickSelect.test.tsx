import { expect } from "chai";
import Enzyme, { shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import * as React from "react";
import { HotKeys, HotKeysProps } from "react-hotkeys";
import "reflect-metadata";
import sinon, { SinonSandbox } from "sinon";

import { QuickSelect } from "components/modals";
import { IHandlers } from "models";
import { IQuickSelectProps } from "props/modals";
import applicationTheme from "settings/internal/themes/dark";
import { IQuickSelectState } from "states/modals";

Enzyme.configure({ adapter: new Adapter() });

describe("<QuickSelect />", () => {
    let props: IQuickSelectProps;
    let component: React.ReactElement<IQuickSelectProps>;

    let sandbox: SinonSandbox;

    beforeEach(() => {
        props = {
            initialItems: ["item1", "item2"],
            onSelect: () => { },
            onClose: () => { },
            isOpen: false,
            theme: applicationTheme
        };

        component = <QuickSelect {...props} />;
        sandbox = sinon.createSandbox();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("begins with a 'selectedIndex' of 0", () => {
        const wrapper = shallow(component);
        const state = wrapper.instance().state as IQuickSelectState;

        expect(state.selectedIndex).to.equal(0);
    });

    it("contains a text input with given 'inputValue'", () => {
        const inputValue = "some input";
        const wrapper = shallow(component);
        wrapper.setProps({ inputValue } as IQuickSelectProps);
        const input = wrapper.find("input");

        expect(input.props().value).to.equal(inputValue);
    });

    it("renders all given items", () => {
        const wrapper = shallow(component);
        const listItems = wrapper.find("li");

        expect(listItems).to.have.length(props.initialItems.length);
    });

    it("renders only once on mount", () => {
        const renderSpy = sandbox.spy(QuickSelect.prototype, "render");
        shallow(component);

        expect(renderSpy.callCount).to.equal(1);
    });

    it("renders only once on update", () => {
        const wrapper = shallow(component);
        const renderSpy = sandbox.spy(QuickSelect.prototype, "render");
        wrapper.instance().forceUpdate();

        expect(renderSpy.callCount).to.equal(1);
    });

    it("re-renders once on change of 'selectedIndex'", () => {
        const wrapper = shallow(component);
        const renderSpy = sandbox.spy(QuickSelect.prototype, "render");
        wrapper.instance().setState({ selectedIndex: 1 } as IQuickSelectState);

        expect(renderSpy.callCount).to.equal(1);
    });

    it("can request to be closed", () => {
        const onCloseStub = sandbox.stub();
        props.onClose = onCloseStub;
        component = <QuickSelect { ...props } />;
        const wrapper = shallow(component);
        const hotkeys = wrapper.find(HotKeys);
        const hotkeysProps = hotkeys.props() as HotKeysProps;
        expect(hotkeysProps.handlers).to.exist;
        (hotkeysProps.handlers as IHandlers).close();

        expect(onCloseStub.calledOnce).to.be.true;
    });

    it("sets 'selectedIndex' on completing input", () => {
        const wrapper = shallow(component);
        const hotkeys = wrapper.find(HotKeys);
        const hotkeysProps = hotkeys.props() as HotKeysProps;
        expect(hotkeysProps.handlers).to.exist;
        (hotkeysProps.handlers as IHandlers).complete();
        const state = wrapper.state() as IQuickSelectState;

        expect(state.selectedIndex).to.equal(0);
    });
});
