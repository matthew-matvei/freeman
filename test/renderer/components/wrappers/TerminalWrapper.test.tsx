import { expect } from "chai";
import Enzyme, { shallow } from "enzyme";
import ReactSixteenAdapter from "enzyme-adapter-react-16";
import * as React from "react";
import "reflect-metadata";
import { IMock, Mock } from "typemoq";

import { TerminalWrapper } from "components/wrappers";
import { ISettingsManager } from "managers";
import { ITheme } from "models";
import { IIntegratedTerminal } from "objects";
import { ITerminalWrapperProps } from "props/wrappers";
import applicationSettings from "settings/internal/settings";
import applicationTheme from "settings/internal/themes/dark";

Enzyme.configure({ adapter: new ReactSixteenAdapter() });

describe("<TerminalWrapper />", () => {
    let settingsManager: IMock<ISettingsManager>;
    let theme: ITheme;
    let integratedTerminal: IMock<IIntegratedTerminal>;

    let props: ITerminalWrapperProps;
    let component: React.ReactElement<ITerminalWrapperProps>;

    beforeEach(() => {
        theme = applicationTheme;
        settingsManager = Mock.ofType<ISettingsManager>();
        settingsManager.setup(sm => sm.settings).returns(() => applicationSettings);
        integratedTerminal = Mock.ofType<IIntegratedTerminal>();
        props = {
            integratedTerminal: integratedTerminal.object,
            settingsManager: settingsManager.object,
            theme
        };

        component = <TerminalWrapper {...props} />;
    });

    it("renders a <div /> with className 'TerminalWrapper'", () => {
        const wrapper = shallow(component);

        expect(wrapper.findWhere(n => n.type() === "div" && n.hasClass("TerminalWrapper")))
            .to.have.length(1);
    });
});
