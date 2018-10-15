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
import { IDirectoryItem } from 'models';

Enzyme.configure({ adapter: new ReactSixteenAdapter() });

describe("<InputItem />", () => {
    let props: IInputItemProps;
    let component: React.ReactElement<IInputItemProps>;

    let sandbox: SinonSandbox;

    beforeEach(() => {
        props = {
            otherItems: [],
            theme: applicationTheme
        };

        component = <InputItem {...props} />;

        sandbox = Sinon.createSandbox();
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

    describe("when creating a new item", () => {
        let sendUpCreateItemStub: Sinon.SinonStub;

        beforeEach(() => {
            sendUpCreateItemStub = sandbox.stub();
            props.sendUpCreateItem = sendUpCreateItemStub;
            component = <InputItem {...props} />;
        });

        it("always allows the user to cancel item creation", () => {
            const wrapper = mount(component);
            const input = wrapper.find("input").first();
            const event = { key: "Escape" };
            (input.props() as React.InputHTMLAttributes<HTMLInputElement>)
                .onKeyUp!(event as React.KeyboardEvent<HTMLInputElement>);

            expect(sendUpCreateItemStub.calledOnce).to.be.true;
        });

        it("prevents the user creating if the item name is invalid", () => {
            const wrapper = mount(component);
            const input = wrapper.find("input").first();
            (input.instance() as any).value = "";
            const event = { key: "Enter" };
            (input.props() as React.InputHTMLAttributes<HTMLInputElement>)
                .onKeyUp!(event as React.KeyboardEvent<HTMLInputElement>);

            expect(sendUpCreateItemStub.callCount).to.equal(0);
        });

        it("allows the user to create if the item name is valid", () => {
            const wrapper = mount(component);
            const input = wrapper.find("input").first();
            (input.instance() as any).value = "Some valid input";
            const event = { key: "Enter" };
            (input.props() as React.InputHTMLAttributes<HTMLInputElement>)
                .onKeyUp!(event as React.KeyboardEvent<HTMLInputElement>);

            expect(sendUpCreateItemStub.calledOnce).to.be.true;
        });
    });

    describe("when renaming an item", () => {
        let sendUpRenameItemStub: Sinon.SinonStub;
        let item: IDirectoryItem = {
            accessible: true,
            name: "Some item",
            path: "/path/to/",
            isDirectory: false,
            isHidden: false,
            lastModified: new Date(),
            created: new Date()
        };

        beforeEach(() => {
            sendUpRenameItemStub = sandbox.stub();
            props.sendUpRenameItem = sendUpRenameItemStub;
            props.thisItem = item;
            component = <InputItem {...props} />;
        })

        it("always allows the user to cancel item renaming", () => {
            const wrapper = mount(component);
            const input = wrapper.find("input").first();
            const event = { key: "Escape" };
            (input.props() as React.InputHTMLAttributes<HTMLInputElement>)
                .onKeyUp!(event as React.KeyboardEvent<HTMLInputElement>);

            expect(sendUpRenameItemStub.calledOnce).to.be.true;
        });

        it("prevents the user renaming if the item name is invalid", () => {
            const wrapper = mount(component);
            const input = wrapper.find("input").first();
            (input.instance() as any).value = "";
            const event = { key: "Enter" };
            (input.props() as React.InputHTMLAttributes<HTMLInputElement>)
                .onKeyUp!(event as React.KeyboardEvent<HTMLInputElement>);

            expect(sendUpRenameItemStub.callCount).to.equal(0);
        });

        it("allows the user to rename if the item name is valid", () => {
            const wrapper = mount(component);
            const input = wrapper.find("input").first();
            (input.instance() as any).value = "Some valid input";
            const event = { key: "Enter" };
            (input.props() as React.InputHTMLAttributes<HTMLInputElement>)
                .onKeyUp!(event as React.KeyboardEvent<HTMLInputElement>);

            expect(sendUpRenameItemStub.calledOnce).to.be.true;
        });
    });
});
