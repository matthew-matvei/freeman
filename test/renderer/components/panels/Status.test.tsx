import "reflect-metadata";
import * as React from "react";
import { expect } from "chai";
import Enzyme, { shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { SinonSpy } from "sinon";

import { Status } from "components/panels";
import { IStatusProps } from "props/panels";
import { ThemesManager } from "objects/managers";
import { ITheme } from "models";

Enzyme.configure({ adapter: new Adapter() });

describe("<Status />", () => {
    let context: { theme: ITheme };
    let props: IStatusProps;

    let component: React.ReactElement<IStatusProps>;
    let renderSpy: SinonSpy;

    before(() => {
        context = {
            theme: ThemesManager.fake()
        }

        props = {
            message: "test message"
        }
    });

    beforeEach(() => {
        component = <Status message={props.message} />;
    });

    afterEach(() => {
        renderSpy && renderSpy.restore();
    });

    it("contains a <div /> with classname 'Status'", () => {
        const wrapper = shallow(component, { context });

        expect(wrapper.findWhere(n => n.hasClass("Status")))
            .to.have.length(1);
    });
});
