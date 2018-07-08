import { expect } from "chai";
import Enzyme, { shallow } from "enzyme";
import ReactSixteenAdapter from "enzyme-adapter-react-16";
import fileIcons from "file-icons-js";
import * as React from "react";
import { IconBaseProps } from "react-icon-base";
import { FaFileO, FaFolderO } from "react-icons/lib/fa";
import "reflect-metadata";
import Sinon, { SinonSandbox } from "sinon";

import { DirectoryItemIcon } from "components/blocks";
import { IDirectoryItem } from "models";
import applicationTheme from "settings/internal/themes/dark";

Enzyme.configure({ adapter: new ReactSixteenAdapter() });

describe("<DirectoryItemIcon />", () => {
    let directoryItem: IDirectoryItem;

    let sandbox: SinonSandbox;

    beforeEach(() => {
        directoryItem = {
            accessible: true,
            created: new Date(),
            isDirectory: false,
            isHidden: false,
            lastModified: new Date(),
            name: "Some directory item",
            path: "/path/to/Some directory item"
        };

        sandbox = Sinon.createSandbox();
    });

    afterEach(() => {
        sandbox && sandbox.restore();
    });

    it("renders an <FaFolderO /> when given a folder", () => {
        directoryItem.isDirectory = true;
        const component = <DirectoryItemIcon directoryItem={directoryItem} theme={applicationTheme} />;
        const wrapper = shallow(component);

        expect(wrapper.find(FaFolderO)).to.have.length(1);
    });

    it("renders an <FaFileO /> when file type unsresolvable", () => {
        sandbox.stub(fileIcons, "getClassWithColor").returns(null);
        const component = <DirectoryItemIcon directoryItem={directoryItem} theme={applicationTheme} />;
        const wrapper = shallow(component);

        expect(wrapper.find(FaFileO)).to.have.length(1);
    });

    it("renders an <i /> with retrieved className when file type resolvable", () => {
        const className = "some-class";
        sandbox.stub(fileIcons, "getClassWithColor").returns(className);
        const component = <DirectoryItemIcon directoryItem={directoryItem} theme={applicationTheme} />;
        const wrapper = shallow(component);

        expect(wrapper.findWhere(n => n.type() === "i" && n.hasClass(className))).to.have.length(1);
    });

    it("icon of inaccessible folder is reflected by colour", () => {
        directoryItem.accessible = false;
        directoryItem.isDirectory = true;
        const component = <DirectoryItemIcon directoryItem={directoryItem} theme={applicationTheme} />;
        const wrapper = shallow(component);
        const folder = wrapper.find(FaFolderO);

        expect((folder.props() as IconBaseProps).color)
            .to.equal(applicationTheme.directoryItemIcon.inaccessibleIconColour);
    });

    it("icon of inaccessible file is reflected by colour", () => {
        sandbox.stub(fileIcons, "getClassWithColor").returns(null);
        directoryItem.accessible = false;
        directoryItem.isDirectory = false;
        const component = <DirectoryItemIcon directoryItem={directoryItem} theme={applicationTheme} />;
        const wrapper = shallow(component);
        const file = wrapper.find(FaFileO);

        expect((file.props() as IconBaseProps).color)
            .to.equal(applicationTheme.directoryItemIcon.inaccessibleIconColour);
    });
});
