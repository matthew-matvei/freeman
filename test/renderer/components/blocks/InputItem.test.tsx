import * as React from "react";
import { expect } from "chai";
import Enzyme, { mount, shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import sinon, { SinonSpy } from "sinon";

import { InputItem } from "components/blocks";
import { IInputItemProps } from "props/blocks";
import { IInputItemState } from "states/blocks";

Enzyme.configure({ adapter: new Adapter() });

describe("<InputItem />", () => {
    let props: IInputItemProps;
    let component: React.ReactElement<IInputItemProps>;

    let renderSpy: SinonSpy;

    before(() => {
        props = {
            otherItems: []
        };
    });

    beforeEach(() => {
        component = <InputItem {...props} />;
    });

    afterEach(() => {
        renderSpy && renderSpy.restore();
    });

    it("renders a text input", () => {
        const wrapper = shallow(component);

        expect(wrapper.find("input")).to.have.length(1);
    });

    it("begins with 'isInvalid' as false", () => {
        const wrapper = shallow(component);
        const state = wrapper.state() as IInputItemState;

        expect(state.isInvalid).to.be.false;
    });

    it("only re-renders on change in validity", () => {
        const wrapper = mount(component);
        renderSpy = sinon.spy(InputItem.prototype, "render");
        wrapper.setState({ isInvalid: true });
        expect(renderSpy.callCount).to.equal(1);
        wrapper.setState({ isInvalid: true });
        expect(renderSpy.callCount).to.equal(1);
        wrapper.setState({ isInvalid: false });
        expect(renderSpy.callCount).to.equal(2);
    });
});
