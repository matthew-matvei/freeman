import { expect } from "chai";
import Enzyme, { shallow } from "enzyme";
import ReactSixteenAdapter from "enzyme-adapter-react-16";
import * as React from "react";
import "reflect-metadata";

import { TerminalHeader } from "components/panels";
import { ITerminalHeaderProps } from "props/panels";
import applicationTheme from "settings/internal/themes/dark";

Enzyme.configure({ adapter: new ReactSixteenAdapter() });

describe("<TerminalHeader />", () => {
    let props: ITerminalHeaderProps;
    let component: React.ReactElement<ITerminalHeaderProps>;

    beforeEach(() => {
        props = {
            shellName: "bash",
            theme: applicationTheme
        };

        component = <TerminalHeader {...props} />;
    });

    it("renders a <div /> with the className 'TerminalHeader'", () => {
        const wrapper = shallow(component);

        expect(wrapper.findWhere(n => n.type() === "div" && n.hasClass("TerminalHeader")))
            .to.have.length(1);
    });
});
