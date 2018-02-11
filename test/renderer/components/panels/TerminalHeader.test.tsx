import { expect } from "chai";
import Enzyme, { shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import * as React from "react";
import "reflect-metadata";

import { TerminalHeader } from "components/panels";
import { ITerminalHeaderProps } from "props/panels";

Enzyme.configure({ adapter: new Adapter() });

describe("<TerminalHeader />", () => {
    let shellName: string;
    let component: React.ReactElement<ITerminalHeaderProps>;

    beforeEach(() => {
        shellName = "bash";
        component = <TerminalHeader shellName={shellName} />;
    });

    it("renders a <div /> with the className 'TerminalHeader'", () => {
        const wrapper = shallow(component);

        expect(wrapper.findWhere(n => n.type() === "div" && n.hasClass("TerminalHeader")))
            .to.have.length(1);
    });
});
