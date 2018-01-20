import { expect } from "chai";
import Enzyme, { shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import * as React from "react";
import "reflect-metadata";

import { Status } from "components/panels";
import { ITheme } from "models";
import { IStatusProps } from "props/panels";
import applicationTheme from "settings/internal/themes/dark";

Enzyme.configure({ adapter: new Adapter() });

describe("<Status />", () => {
    let context: { theme: ITheme };
    let props: IStatusProps;

    let component: React.ReactElement<IStatusProps>;

    before(() => {
        context = {
            theme: applicationTheme
        };

        props = {
            message: "test message",
            itemCount: 0,
            chosenCount: 0
        };
    });

    beforeEach(() => {
        component = <Status {...props} />;
    });

    it("contains a <div /> with classname 'Status'", () => {
        const wrapper = shallow(component, { context });

        expect(wrapper.findWhere(n => n.hasClass("Status")))
            .to.have.length(1);
    });
});
