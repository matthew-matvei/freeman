import "reflect-metadata";
import * as React from "react";
import { expect } from "chai";
import Enzyme, { shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import sinon, { SinonSpy } from "sinon";

import { IQuickSelectProps } from "props/modals";
import { IQuickSelectState } from "states/modals";
import { IAppContext } from "models";
import { ThemesManager } from "objects/managers";
import { QuickSelect } from 'components/modals';

Enzyme.configure({ adapter: new Adapter() });

describe("<QuickSelect />", () => {
    let context: IAppContext;
    let props: IQuickSelectProps;
    let component: React.ReactElement<IQuickSelectProps>;

    let renderSpy: SinonSpy;

    before(() => {
        context = {
            theme: ThemesManager.fake()
        };
    });

    beforeEach(() => {
        props = {
            initialItems: ["item1", "item2"],
            onSelect: () => { },
            onClose: () => { },
            isOpen: false
        };
    });

    afterEach(() => {
        renderSpy && renderSpy.restore();
    });

    it("begins with a 'selectedIndex' of 0", () => {
        component = <QuickSelect {...props} />;
        const wrapper = shallow(component, { context });
        const state = wrapper.instance().state as IQuickSelectState;

        expect(state.selectedIndex).to.equal(0);
    });

    it("contains a text input with given 'inputValue'", () => {
        props.inputValue = "some input";
        component = <QuickSelect {...props} />;
        const wrapper = shallow(component, { context });
        const input = wrapper.find("input");

        expect(input.props().value).to.equal(props.inputValue);
    });

    it("renders all given items", () => {
        component = <QuickSelect {...props} />;
        const wrapper = shallow(component, { context });
        const listItems = wrapper.find("li");

        expect(listItems).to.have.length(props.initialItems.length);
    });

    it("renders only once on mount", () => {
        renderSpy = sinon.spy(QuickSelect.prototype, "render");
        shallow(component, { context });

        expect(renderSpy.callCount).to.equal(1);
    });

    it("renders only once on update", () => {
        const wrapper = shallow(component, { context });
        renderSpy = sinon.spy(QuickSelect.prototype, "render");
        wrapper.instance().forceUpdate();

        expect(renderSpy.callCount).to.equal(1);
    });

    it("re-renders once on change of 'selectedIndex'", () => {
        const wrapper = shallow(component, { context });
        renderSpy = sinon.spy(QuickSelect.prototype, "render");
        wrapper.instance().setState({ selectedIndex: 1 } as IQuickSelectState);

        expect(renderSpy.callCount).to.equal(1);
    });
});
