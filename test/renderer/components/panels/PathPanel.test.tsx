import "reflect-metadata";
import * as React from "react";
import { expect } from "chai";
import Enzyme, { shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { SinonSpy } from "sinon";

import applicationTheme from "configuration/internal/themes/dark";
import { PathPanel } from "components/panels";
import { IPathPanelProps } from "props/panels";
import { IAppContext } from 'models';

Enzyme.configure({ adapter: new Adapter() });

describe("<PathPanel />", () => {
    let context: IAppContext;
    let props: IPathPanelProps;

    let component: React.ReactElement<IPathPanelProps>;

    let renderSpy: SinonSpy;

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

    afterEach(() => {
        renderSpy && renderSpy.restore();
    });

    it("contains a <div /> with classname 'PathPanel'", () => {
        const wrapper = shallow(component, { context: context });

        expect(wrapper.findWhere(n => n.hasClass("PathPanel")))
            .to.have.length(1);
    });
});
