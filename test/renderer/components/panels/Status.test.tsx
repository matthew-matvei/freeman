import { expect } from "chai";
import Enzyme, { shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import * as React from "react";
import "reflect-metadata";

import { Status } from "components/panels";
import { IStatusProps } from "props/panels";
import applicationTheme from "settings/internal/themes/dark";

Enzyme.configure({ adapter: new Adapter() });

describe("<Status />", () => {
    let props: IStatusProps;

    let component: React.ReactElement<IStatusProps>;

    before(() => {
        props = {
            message: "test message",
            itemCount: 0,
            chosenCount: 0,
            theme: applicationTheme
        };
    });

    beforeEach(() => {
        component = <Status {...props} />;
    });

    it("contains a <div /> with classname 'Status'", () => {
        const wrapper = shallow(component);

        expect(wrapper.findWhere(n => n.hasClass("Status")))
            .to.have.length(1);
    });
});
