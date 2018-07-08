import { expect } from "chai";
import { shell } from "electron";
import Enzyme, { shallow } from "enzyme";
import ReactSixteenAdapter from "enzyme-adapter-react-16";
import * as React from "react";
import { HotKeys, HotKeysProps } from "react-hotkeys";
import "reflect-metadata";
import Sinon, { SinonSandbox, SinonSpy } from "sinon";

import { DirectoryItem } from "components/blocks";
import { IDirectoryItem, IHandlers } from "models";
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
            accessible: true,
            created: new Date(),
            isDirectory: false,
            isHidden: false,
            lastModified: new Date(),
            name: "item.txt",
            path: "/path/to/"
        };

        props = {
            columnSizes: {
                createdOn: 0,
                lastModified: 25,
                name: 50,
                size: 25
            },
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
        wrapper.forEach(n => n.simulate("doubleClick"));

        expect(sendPathUp.callCount).to.equal(wrapper.length);
    });

    it("requests selecting the item when clicked", () => {
        const sendSelectionUp = sandbox.stub();
        props.sendSelectedItemUp = sendSelectionUp;
        component = <DirectoryItem {...props} />;
        const wrapper = shallow(component).find("button");
        wrapper.forEach(n => n.simulate("click"));

        expect(sendSelectionUp.callCount).to.equal(wrapper.length);
    });

    it("opens item using Electron shell when file activated", () => {
        const openItem = sandbox.stub(shell, "openItem");
        const wrapper = shallow(component).find("button");
        wrapper.forEach(n => n.simulate("doubleClick"));

        expect(openItem.callCount).to.equal(wrapper.length);
    });

    it("background colour changes when item is selected", () => {
        props.isSelected = false;
        component = <DirectoryItem {...props} />;
        const unselectedWrapper = shallow(component);

        expect(unselectedWrapper.findWhere(n => n.type() === "div" &&
            (n.props().style as React.CSSProperties).backgroundColor ===
            applicationTheme.directoryItem.backgroundColour)).to.have.length(1);

        props.isSelected = true;
        component = <DirectoryItem {...props} />;
        const selectedWrapper = shallow(component);

        expect(selectedWrapper.findWhere(n => n.type() === "div" &&
            (n.props().style as React.CSSProperties).backgroundColor ===
            applicationTheme.directoryItem.selectedBackgroundColour)).to.have.length(1);
    });

    it("foreground colour shows inaccessibility if item is not chosen", () => {
        props.model.accessible = false;
        component = <DirectoryItem {...props} />;
        const wrapper = shallow(component);

        expect(wrapper.findWhere(n => n.type() === "button" &&
            (n.props().style as React.CSSProperties).color ===
            applicationTheme.directoryItem.inaccessibleColour)).to.have.length.greaterThan(0);
    });
    it("does not open a directory that is inaccessible", () => {
        const sendPathUp = sandbox.stub();
        props.model.isDirectory = true;
        props.model.accessible = false;
        props.sendPathUp = sendPathUp;
        component = <DirectoryItem {...props} />;
        const wrapper = shallow(component);
        const hotKeys = wrapper.find(HotKeys);
        ((hotKeys.props() as HotKeysProps).handlers as IHandlers).activate();

        expect(sendPathUp.callCount).to.equal(0);
    });
    it("does not activate an item that is inaccessible", () => {
        const sendPathUp = sandbox.stub();
        props.model.isDirectory = false;
        props.model.accessible = false;
        props.sendPathUp = sendPathUp;
        component = <DirectoryItem {...props} />;
        const wrapper = shallow(component);
        const hotKeys = wrapper.find(HotKeys);
        ((hotKeys.props() as HotKeysProps).handlers as IHandlers).activate();

        expect(sendPathUp.callCount).to.equal(0);
    });
});
