import "reflect-metadata";
import * as React from "react";
import { expect } from "chai";
import Enzyme, { shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import sinon, { SinonSpy } from "sinon";

import { CommandPalette } from "components/modals";
import { ICommandPaletteProps } from "props/modals";

Enzyme.configure({ adapter: new Adapter() });

describe("<CommandPalette />", () => {
    let props: ICommandPaletteProps;
    let component: React.ReactElement<ICommandPaletteProps>;
    let renderSpy: SinonSpy;

    before(() => {
        props = {
            isOpen: false,
            applicationCommands: { reloadWindow: () => { } },
            onClose: () => { }
        };
    });

    beforeEach(() => {
        component = <CommandPalette {...props} />;
    });

    afterEach(() => {
        renderSpy && renderSpy.restore();
    });

    it("renders once when mounted", () => {
        renderSpy = sinon.spy(CommandPalette.prototype, "render");
        shallow(component);

        expect(renderSpy.callCount).to.equal(1);
    });

    it("renders once when updated", () => {
        const wrapper = shallow(component);
        renderSpy = sinon.spy(CommandPalette.prototype, "render");
        wrapper.instance().forceUpdate();

        expect(renderSpy.callCount).to.equal(1);
    })
});
