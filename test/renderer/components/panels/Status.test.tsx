import { expect } from "chai";
import Enzyme, { shallow } from "enzyme";
import ReactSixteenAdapter from "enzyme-adapter-react-16";
import * as React from "react";
import "reflect-metadata";

import { Status } from "components/panels";
import { IStatusProps } from "props/panels";
import applicationTheme from "settings/internal/themes/dark";

Enzyme.configure({ adapter: new ReactSixteenAdapter() });

describe("<Status />", () => {
    let props: IStatusProps;

    let component: React.ReactElement<IStatusProps>;

    before(() => {
        props = {
            chosenCount: 0,
            itemCount: 0,
            message: "test message",
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
