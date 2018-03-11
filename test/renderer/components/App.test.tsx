import { expect } from "chai";
import Enzyme, { shallow } from "enzyme";
import ReactSixteenAdapter from "enzyme-adapter-react-16";
import * as React from "react";
import "reflect-metadata";
import Sinon, { SinonSandbox } from "sinon";
import { IMock, Mock } from "typemoq";

import { App } from "components";
import { IDirectoryManager, IKeysManager, ISettingsManager, IThemesManager } from "managers";
import { IHandlers } from "models";
import { IAppProps } from "props";
import { HotKeys, HotKeysProps } from "react-hotkeys";
import applicationTheme from "settings/internal/themes/dark";
import { IAppState } from "states";

Enzyme.configure({ adapter: new ReactSixteenAdapter() });

describe("<App />", () => {
    let props: IAppProps;

    let directoryManager: IMock<IDirectoryManager>;
    let keysManager: IMock<IKeysManager>;
    let settingsManager: IMock<ISettingsManager>;
    let themeManager: IMock<IThemesManager>;

    let component: React.ReactElement<IAppProps>;

    let sandbox: SinonSandbox;

    before(() => {
        directoryManager = Mock.ofType<IDirectoryManager>();
        keysManager = Mock.ofType<IKeysManager>();
        settingsManager = Mock.ofType<ISettingsManager>();
        themeManager = Mock.ofType<IThemesManager>();
        themeManager.setup(tm => tm.theme).returns(() => applicationTheme);

        props = {
            directoryManager: directoryManager.object,
            keysManager: keysManager.object,
            settingsManager: settingsManager.object,
            themeManager: themeManager.object
        };

        component = <App {...props} />;

        sandbox = Sinon.createSandbox();
    });

    afterEach(() => {
        sandbox && sandbox.restore();
    });

    it("starts with the left pane selected", () => {
        const wrapper = shallow(component);
        const state = wrapper.state() as IAppState;

        expect(state.selectedPane).to.equal("left");
    });

    it("starts with the command palette closed", () => {
        const wrapper = shallow(component);
        const state = wrapper.state() as IAppState;

        expect(state.isCommandPaletteOpen).to.be.false;
    });

    it("starts with a blank status", () => {
        const wrapper = shallow(component);
        const state = wrapper.state() as IAppState;

        expect(state.status.chosenCount).to.equal(0);
        expect(state.status.itemCount).to.equal(0);
        expect(state.status.message).to.equal("");
    });

    it("can switch active pane from left to right", () => {
        const wrapper = shallow(component);
        const hotkeys = wrapper.find(HotKeys);
        expect((hotkeys.props() as HotKeysProps).handlers).to.exist;
        ((hotkeys.props() as HotKeysProps).handlers! as IHandlers)
            .switchPane();
        const state = wrapper.state() as IAppState;

        expect(state.selectedPane).to.equal("right");
    });

    it("can switch active pane from right to left", () => {
        const wrapper = shallow(component);
        wrapper.setState({ selectedPane: "right" } as IAppState);
        const hotkeys = wrapper.find(HotKeys);
        const hotkeysProps = hotkeys.props() as HotKeysProps;
        expect(hotkeysProps.handlers).to.exist;
        (hotkeysProps.handlers as IHandlers).switchPane();
        const state = wrapper.state() as IAppState;

        expect(state.selectedPane).to.equal("left");
    });

    it("opens CommandPalette if not currently open", () => {
        const wrapper = shallow(component);
        const hotkeys = wrapper.find(HotKeys);
        const hotkeysProps = hotkeys.props() as HotKeysProps;
        expect(hotkeysProps.handlers).to.exist;
        (hotkeysProps.handlers as IHandlers).openCommandPalette();
        const state = wrapper.state() as IAppState;

        expect(state.isCommandPaletteOpen).to.be.true;
    });

    it("does not update 'isCommandPalette' if it's already open", () => {
        const wrapper = shallow(component);
        const hotkeys = wrapper.find(HotKeys);
        const hotkeysProps = hotkeys.props() as HotKeysProps;
        expect(hotkeysProps.handlers).to.exist;
        (hotkeysProps.handlers as IHandlers).openCommandPalette();
        const renderSpy = sandbox.spy(App.prototype, "render");
        (hotkeysProps.handlers as IHandlers).openCommandPalette();

        expect(renderSpy.callCount).to.equal(0);
    });
});
