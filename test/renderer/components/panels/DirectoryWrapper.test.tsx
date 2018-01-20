import { expect } from "chai";
import Enzyme, { shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import * as React from "react";
import "reflect-metadata";
import sinon, { SinonSpy } from "sinon";
import { IMock, Mock } from "typemoq";

import { DirectoryWrapper } from "components/panels";
import { IDirectoryManager } from "managers";
import { IAppContext, IStatusNotifier } from "models";
import { IDirectoryWrapperProps } from "props/panels";
import applicationTheme from "settings/internal/themes/dark";

Enzyme.configure({ adapter: new Adapter() });

describe("<DirectoryWrapper />", () => {
    let context: IAppContext;
    let props: IDirectoryWrapperProps;
    let component: React.ReactElement<IDirectoryWrapperProps>;
    let renderSpy: SinonSpy;

    let directoryManager: IMock<IDirectoryManager>;

    before(() => {
        context = {
            theme: applicationTheme
        };

        const statusNotifier = {} as IStatusNotifier;

        directoryManager = Mock.ofType<IDirectoryManager>();

        props = {
            id: "left",
            initialPath: "path/to/initial",
            isSelectedPane: true,
            sendSelectedPaneUp: () => { },
            directoryManager: directoryManager.object,
            statusNotifier
        };
    });

    beforeEach(() => {
        component = <DirectoryWrapper {...props} />;
    });

    afterEach(() => {
        renderSpy && renderSpy.restore();
    });

    it("contains a <div /> with the className 'DirectoryWrapper'", () => {
        const wrapper = shallow(component, { context });

        expect(wrapper.findWhere(n => n.hasClass("DirectoryWrapper")))
            .to.have.length(1);
    });

    it("contains a container with the className 'directoryScrollArea'", () => {
        const wrapper = shallow(component, { context });

        expect(wrapper.findWhere(n => n.hasClass("directoryScrollArea")))
            .to.have.length(1);
    });

    it("re-renders only once when updating path", () => {
        const wrapper = shallow(component, { context });
        renderSpy = sinon.spy(DirectoryWrapper.prototype, "render");
        wrapper.setState({ updatePath: "/new/path" });

        expect(renderSpy.callCount).to.equal(1);
    });
});
