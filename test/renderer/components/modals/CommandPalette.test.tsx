import { expect } from "chai";
import Enzyme, { mount, shallow } from "enzyme";
import ReactSixteenAdapter from "enzyme-adapter-react-16";
import * as React from "react";
import "reflect-metadata";
import Sinon, { SinonSandbox } from "sinon";

import { CommandPalette, QuickSelect } from "components/modals";
import { ICommandPaletteProps, IQuickSelectProps } from "props/modals";
import applicationTheme from "settings/internal/themes/dark";

Enzyme.configure({ adapter: new ReactSixteenAdapter() });

describe("<CommandPalette />", () => {
    let props: ICommandPaletteProps;
    let component: React.ReactElement<ICommandPaletteProps>;
    let sandbox: SinonSandbox;

    before(() => {
        props = {
            applicationCommands: { reloadWindow: () => { } },
            isOpen: false,
            onClose: () => { },
            theme: applicationTheme
        };

        sandbox = Sinon.createSandbox();
    });

    beforeEach(() => {
        component = <CommandPalette {...props} />;
    });

    afterEach(() => {
        sandbox && sandbox.restore();
    });

    it("renders once when mounted", () => {
        const renderSpy = sandbox.spy(CommandPalette.prototype, "render");
        shallow(component);

        expect(renderSpy.callCount).to.equal(1);
    });

    it("renders once when updated", () => {
        const wrapper = shallow(component);
        const renderSpy = sandbox.spy(CommandPalette.prototype, "render");
        wrapper.instance().forceUpdate();

        expect(renderSpy.callCount).to.equal(1);
    });

    it("can invoke the application command selected", () => {
        const reloadWindowStub = sandbox.stub();
        props.applicationCommands.reloadWindow = reloadWindowStub;
        component = <CommandPalette {...props} />;
        const wrapper = mount(component);
        const quickSelect = wrapper.find(QuickSelect);
        (quickSelect.props() as IQuickSelectProps).onSelect("reloadWindow");

        expect(reloadWindowStub.calledOnce).to.be.true;
    });
});
