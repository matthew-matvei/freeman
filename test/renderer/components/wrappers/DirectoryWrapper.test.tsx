import { expect } from "chai";
import Enzyme, { mount, shallow } from "enzyme";
import ReactSixteenAdapter from "enzyme-adapter-react-16";
import * as React from "react";
import { HotKeys, HotKeysProps } from "react-hotkeys";
import "reflect-metadata";
import Sinon, { SinonSandbox } from "sinon";
import { IMock, It, Mock } from "typemoq";

import { DirectoryWrapper } from "components/wrappers";
import { IDirectoryManager, ISettingsManager } from "managers";
import { IHandlers, IStatusNotifier } from "models";
import { IIntegratedTerminal } from "objects";
import { IDirectoryWrapperProps } from "props/wrappers";
import applicationSettings from "settings/internal/settings";
import applicationTheme from "settings/internal/themes/dark";
import { IDirectoryWrapperState } from "states/panels";
import Utils from "Utils";

Enzyme.configure({ adapter: new ReactSixteenAdapter() });

describe("<DirectoryWrapper />", () => {
    let props: IDirectoryWrapperProps;
    let component: React.ReactElement<IDirectoryWrapperProps>;

    let sandbox: SinonSandbox;

    let directoryManager: IMock<IDirectoryManager>;
    let settingsManager: IMock<ISettingsManager>;
    let integratedTerminal: IMock<IIntegratedTerminal>;

    before(() => {
        directoryManager = Mock.ofType<IDirectoryManager>();
        settingsManager = Mock.ofType<ISettingsManager>();
        settingsManager.setup(sm => sm.settings).returns(() => applicationSettings);
        integratedTerminal = Mock.ofType<IIntegratedTerminal>();
        integratedTerminal.setup(it => it.shellName).returns(() => "bash");

        const statusNotifier = {} as IStatusNotifier;

        directoryManager = Mock.ofType<IDirectoryManager>();

        props = {
            directoryManager: directoryManager.object,
            id: "left",
            initialPath: "path/to/initial",
            integratedTerminal: integratedTerminal.object,
            isSelectedPane: true,
            sendSelectedPaneUp: () => { },
            settingsManager: settingsManager.object,
            statusNotifier,
            theme: applicationTheme
        };
    });

    beforeEach(() => {
        component = <DirectoryWrapper {...props} />;
        sandbox = Sinon.createSandbox();
        directoryManager.setup(async dm => dm.listDirectory(It.isAnyString(), It.isAny()))
            .returns(sandbox.stub().resolves([]));
    });

    afterEach(() => {
        sandbox && sandbox.restore();
    });

    it("contains a <div /> with the className 'DirectoryWrapper'", () => {
        const wrapper = shallow(component);

        expect(wrapper.findWhere(n => n.hasClass("DirectoryWrapper")))
            .to.have.length(1);
    });

    it("contains a container with the className 'directoryScrollArea'", () => {
        const wrapper = shallow(component);

        expect(wrapper.findWhere(n => n.hasClass("directoryScrollArea")))
            .to.have.length(1);
    });

    it("starts with 'path' set to 'initialPath'", () => {
        const wrapper = shallow(component);
        const state = wrapper.state() as IDirectoryWrapperState;

        expect(state.path).to.equal(props.initialPath);
    });

    it("re-renders only once when updating path", () => {
        const wrapper = shallow(component);
        const renderSpy = sandbox.spy(DirectoryWrapper.prototype, "render");
        wrapper.setState({ updatePath: "/new/path" });

        expect(renderSpy.callCount).to.equal(1);
    });

    it("can toggle the display of the integrated terminal", () => {
        const wrapper = shallow(component);
        const hotkeys = wrapper.find(HotKeys);
        const hotkeysProps = hotkeys.props() as HotKeysProps;
        expect(hotkeysProps.handlers).to.exist;
        const preState = wrapper.state() as IDirectoryWrapperState;
        (hotkeysProps.handlers as IHandlers)
            .toggleIntegratedTerminal();
        const postState = wrapper.state() as IDirectoryWrapperState;

        expect(postState.isTerminalOpen).to.not.equal(preState.isTerminalOpen);
    });

    it("sets focus when closing the integrated terminal", () => {
        const wrapper = mount(component);
        wrapper.setState({ isTerminalOpen: true } as IDirectoryWrapperState);
        const autoFocusStub = sandbox.stub(Utils, "autoFocus");

        const hotkeys = wrapper.find(HotKeys).first();
        const hotkeysProps = hotkeys.props() as HotKeysProps;
        expect(hotkeysProps.handlers).to.exist;
        (hotkeysProps.handlers as IHandlers)
            .toggleIntegratedTerminal();

        expect(autoFocusStub.calledOnce).to.be.true;
    });
});
