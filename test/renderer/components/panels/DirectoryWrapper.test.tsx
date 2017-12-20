import "reflect-metadata";
import * as React from "react";
import { expect } from "chai";
import Enzyme, { shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import sinon, { SinonSpy } from "sinon";

import { DirectoryWrapper } from "components/panels";
import { IDirectoryWrapperProps } from "props/panels";
import { IAppContext } from 'models';
import { IDirectoryManager, ThemesManager } from "objects/managers";

Enzyme.configure({ adapter: new Adapter() });

describe("<DirectoryPane />", () => {
    let context: IAppContext;
    let props: IDirectoryWrapperProps;
    let component: React.ReactElement<IDirectoryWrapperProps>;
    let renderSpy: SinonSpy;

    let directoryManager: IDirectoryManager;

    before(() => {
        context = {
            theme: ThemesManager.fake()
        }

        props = {
            id: "left",
            initialPath: "path/to/initial",
            isSelectedPane: true,
            sendSelectedPaneUp: () => { },
            directoryManager
        };
    });

    beforeEach(() => {
        component = <DirectoryWrapper {...props} />;
    });

    afterEach(() => {
        renderSpy && renderSpy.restore();
    });

    it("contains a <div /> with the className 'DirectoryPane'", () => {
        const wrapper = shallow(component, { context });

        expect(wrapper.findWhere(n => n.hasClass("DirectoryPane")))
            .to.have.length(1);
    });

    it("contains a container with the className 'directoryScrollArea'", () => {
        const wrapper = shallow(component, { context });

        expect(wrapper.findWhere(n => n.hasClass("directoryScrollArea")))
            .to.have.length(1);
    });

    it("contains a container with the className 'terminalScrollArea'", () => {
        const wrapper = shallow(component, { context });

        expect(wrapper.findWhere(n => n.hasClass("terminalScrollArea")))
            .to.have.length(1);
    });

    it("re-renders only once when updating path", () => {
        const wrapper = shallow(component, { context });
        renderSpy = sinon.spy(DirectoryWrapper.prototype, "render");
        wrapper.setState({ updatePath: "/new/path" });

        expect(renderSpy.callCount).to.equal(1);
    });
});
