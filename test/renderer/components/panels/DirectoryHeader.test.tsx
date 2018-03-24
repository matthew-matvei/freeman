import { expect } from "chai";
import Enzyme, { mount, shallow } from "enzyme";
import ReactSixteenAdapter from "enzyme-adapter-react-16";
import * as React from "react";
import "reflect-metadata";
import Sinon, { SinonSandbox } from "sinon";

import { DirectoryHeader } from "components/panels";
import { IDirectoryHeaderProps } from "props/panels";
import applicationTheme from "settings/internal/themes/dark";

Enzyme.configure({ adapter: new ReactSixteenAdapter() });

describe("<DirectoryHeader />", () => {
    let props: IDirectoryHeaderProps;
    let component: React.ReactElement<IDirectoryHeaderProps>;

    let sandbox: SinonSandbox;

    before(() => {
        sandbox = Sinon.createSandbox();

    });

    beforeEach(() => {
        props = {
            columnSizes: {
                lastModified: 50,
                name: 50,
                size: 50
            },
            theme: applicationTheme,
            updateColumnSizes: sandbox.stub()
        };

        component = <DirectoryHeader {...props} />;
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("renders a <div /> with className='DirectoryHeader'", () => {
        const wrapper = shallow(component);

        expect(wrapper.findWhere(n => n.type() === "div" && n.hasClass("DirectoryHeader")))
            .to.have.length(1);
    });

    it("updates column sizes after mounting", () => {
        const updateColumnSizesStub = sandbox.stub();
        props.updateColumnSizes = updateColumnSizesStub;
        component = <DirectoryHeader {...props} />;
        mount(component);

        expect(updateColumnSizesStub.calledOnce).to.be.true;
    });
});
