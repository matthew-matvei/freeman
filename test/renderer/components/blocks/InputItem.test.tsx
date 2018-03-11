import { expect } from "chai";
import Enzyme, { mount, shallow } from "enzyme";
import ReactSixteenAdapter from "enzyme-adapter-react-16";
import * as React from "react";
import "reflect-metadata";
import Sinon, { SinonSandbox } from "sinon";

import { InputItem } from "components/blocks";
import { IInputItemProps } from "props/blocks";
import applicationTheme from "settings/internal/themes/dark";
import { IInputItemState } from "states/blocks";

Enzyme.configure({ adapter: new ReactSixteenAdapter() });

describe("<InputItem />", () => {
    let props: IInputItemProps;
    let component: React.ReactElement<IInputItemProps>;

    let sandbox: SinonSandbox;

    before(() => {
        props = {
            otherItems: [],
            theme: applicationTheme
        };

        sandbox = Sinon.createSandbox();
    });

    beforeEach(() => {
        component = <InputItem {...props} />;
    });

    afterEach(() => {
        sandbox && sandbox.restore();
    });

    it("renders a text input", () => {
        const wrapper = shallow(component);

        expect(wrapper.find("input")).to.have.length(1);
    });

    it("renders a <div /> with className 'InputItem'", () => {
        const wrapper = shallow(component);

        expect(wrapper.findWhere(n => n.type() === "div" && n.hasClass("InputItem")));
    });

    it("begins with 'isInvalid' as false", () => {
        const wrapper = shallow(component);
        const state = wrapper.state() as IInputItemState;

        expect(state.isInvalid).to.be.false;
    });

    it("only re-renders on change in validity", () => {
        const wrapper = mount(component);
        const renderSpy = sandbox.spy(InputItem.prototype, "render");
        wrapper.setState({ isInvalid: true });
        expect(renderSpy.callCount).to.equal(1);
        wrapper.setState({ isInvalid: true });
        expect(renderSpy.callCount).to.equal(1);
        wrapper.setState({ isInvalid: false });
        expect(renderSpy.callCount).to.equal(2);
    });
});
