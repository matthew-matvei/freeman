import { expect } from "chai";
import Enzyme, { shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import * as React from "react";
import "reflect-metadata";

import { PathPanel } from "components/panels";
import { IAppContext } from "models";
import { IPathPanelProps } from "props/panels";
import applicationTheme from "settings/internal/themes/dark";

Enzyme.configure({ adapter: new Adapter() });

describe("<PathPanel />", () => {
    let context: IAppContext;
    let props: IPathPanelProps;

    let component: React.ReactElement<IPathPanelProps>;

    before(() => {
        context = {
            theme: applicationTheme
        };

        props = {
            path: "/path/to/directory"
        };
    });

    beforeEach(() => {
        component = <PathPanel {...props} />;
    });

    it("contains a <div /> with classname 'PathPanel'", () => {
        const wrapper = shallow(component, { context });

        expect(wrapper.findWhere(n => n.hasClass("PathPanel")))
            .to.have.length(1);
    });
});
