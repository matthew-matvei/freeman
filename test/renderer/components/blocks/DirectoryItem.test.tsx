import { expect } from "chai";
import { shell } from "electron";
import Enzyme, { shallow } from "enzyme";
import ReactSixteenAdapter from "enzyme-adapter-react-16";
import * as React from "react";
import "reflect-metadata";
import Sinon, { SinonSandbox, SinonSpy } from "sinon";

import { DirectoryItem } from "components/blocks";
import { IDirectoryItem } from "models";
import { IDirectoryItemProps } from "props/blocks";
import applicationTheme from "settings/internal/themes/dark";

Enzyme.configure({ adapter: new ReactSixteenAdapter() });

describe("<DirectoryItem />", () => {
    let props: IDirectoryItemProps;
    let component: React.ReactElement<IDirectoryItemProps>;

    let directoryModel: IDirectoryItem;

    let sandbox: SinonSandbox;
    let renderSpy: SinonSpy;

    beforeEach(() => {
        directoryModel = {
            isDirectory: false,
            isHidden: false,
            name: "item.txt",
            path: "/path/to/"
        };

        props = {
            isChosen: false,
            isSelected: false,
            model: directoryModel,
            sendDeletionUp: () => { },
            sendPathUp: (path: string) => { },
            sendSelectedItemUp: (selectedItem: IDirectoryItem) => { },
            theme: applicationTheme
        };

        sandbox = Sinon.createSandbox();

        component = <DirectoryItem {...props} />;
    });

    afterEach(() => {
        sandbox && sandbox.restore();
    });

    it("has the className 'DirectoryItem'", () => {
        const wrapper = shallow(component);

        expect(wrapper.findWhere(n => n.hasClass("DirectoryItem")))
            .to.have.length(1);
    });

    it("has the className 'selected' when item is selected", () => {
        props.isSelected = true;
        component = <DirectoryItem {...props} />;
        const wrapper = shallow(component);

        expect(wrapper.findWhere(n => n.hasClass("selected")))
            .to.have.length(1);
    });

    it("does not have the className 'selected' when item is not selected", () => {
        const wrapper = shallow(component);

        expect(wrapper.findWhere(n => n.hasClass("selected")))
            .to.have.length(0);
    });

    it("renders only once when mounted", () => {
        renderSpy = sandbox.spy(DirectoryItem.prototype, "render");
        shallow(component);

        expect(renderSpy.callCount).to.equal(1);
    });

    it("renders only once when updated", () => {
        const wrapper = shallow(component);
        renderSpy = sandbox.spy(DirectoryItem.prototype, "render");
        wrapper.instance().forceUpdate();

        expect(renderSpy.callCount).to.equal(1);
    });

    it("requests path update when directory activated", () => {
        const sendPathUp = sandbox.stub();
        props.model.isDirectory = true;
        props.sendPathUp = sendPathUp;
        component = <DirectoryItem {...props} />;
        const wrapper = shallow(component).find("button");
        wrapper.simulate("doubleClick");

        expect(sendPathUp.calledOnce).to.be.true;
    });

    it("requests selecting the item when clicked", () => {
        const sendSelectionUp = sandbox.stub();
        props.sendSelectedItemUp = sendSelectionUp;
        component = <DirectoryItem {...props} />;
        const wrapper = shallow(component).find("button");
        wrapper.simulate("click");

        expect(sendSelectionUp.calledOnce).to.be.true;
    });

    it("opens item using Electron shell when file activated", () => {
        const openItem = sandbox.stub(shell, "openItem");
        const wrapper = shallow(component).find("button");
        wrapper.simulate("doubleClick");

        expect(openItem.calledOnce).to.be.true;
    });
});
