import "reflect-metadata";
import * as React from "react";
import { expect } from "chai";
import { shell } from "electron";
import Enzyme, { shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import sinon, { SinonSandbox, SinonSpy } from "sinon";

import applicationTheme from "configuration/internal/themes/dark";
import { DirectoryItem } from "components/blocks";
import { IDirectoryItemProps } from "props/blocks";
import { IAppContext, IDirectoryItem } from "models";

Enzyme.configure({ adapter: new Adapter() });

describe("<DirectoryItem />", () => {
    let context: IAppContext;
    let props: IDirectoryItemProps;
    let component: React.ReactElement<IDirectoryItemProps>;

    let directoryModel: IDirectoryItem;

    let sandbox: SinonSandbox;
    let renderSpy: SinonSpy;

    before(() => {
        context = {
            theme: applicationTheme
        };
    });

    beforeEach(() => {
        directoryModel = {
            name: "item.txt",
            path: "/path/to/",
            isDirectory: false,
            isHidden: false
        }

        props = {
            model: directoryModel,
            isSelected: false,
            isChosen: false,
            sendPathUp: (path: string) => { },
            sendSelectedItemUp: (selectedItem: IDirectoryItem) => { },
            sendDeletionUp: () => { }
        }

        sandbox = sinon.createSandbox();
    });

    afterEach(() => {
        sandbox && sandbox.restore();
    });

    it("has the className 'DirectoryItem'", () => {
        component = <DirectoryItem {...props} />;
        const wrapper = shallow(component, { context });

        expect(wrapper.findWhere(n => n.hasClass("DirectoryItem")))
            .to.have.length(1);
    });

    it("has the className 'selected' when item is selected", () => {
        props.isSelected = true;
        component = <DirectoryItem {...props} />;
        const wrapper = shallow(component, { context });

        expect(wrapper.findWhere(n => n.hasClass("selected")))
            .to.have.length(1);
    });

    it("does not have the className 'selected' when item is not selected", () => {
        component = <DirectoryItem {...props} />;
        const wrapper = shallow(component, { context });

        expect(wrapper.findWhere(n => n.hasClass("selected")))
            .to.have.length(0);
    });

    it("renders only once when mounted", () => {
        component = <DirectoryItem {...props} />;
        renderSpy = sandbox.spy(DirectoryItem.prototype, "render");
        shallow(component, { context });

        expect(renderSpy.callCount).to.equal(1);
    });

    it("renders only once when updated", () => {
        component = <DirectoryItem {...props} />;
        const wrapper = shallow(component, { context });
        renderSpy = sandbox.spy(DirectoryItem.prototype, "render");
        wrapper.instance().forceUpdate();

        expect(renderSpy.callCount).to.equal(1);
    });

    it("requests path update when directory activated", () => {
        const sendPathUp = sandbox.stub();
        props.model.isDirectory = true;
        props.sendPathUp = sendPathUp;
        component = <DirectoryItem {...props} />;
        const wrapper = shallow(component, { context }).find("button");
        wrapper.simulate("doubleClick");

        expect(sendPathUp.calledOnce).to.be.true;
    });

    it("opens item using Electron shell when file activated", () => {
        const openItem = sandbox.stub(shell, "openItem");
        component = <DirectoryItem {...props} />;
        const wrapper = shallow(component, { context }).find("button");
        wrapper.simulate("doubleClick");

        expect(openItem.calledOnce).to.be.true;
    });
});
