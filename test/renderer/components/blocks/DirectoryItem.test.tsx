import "reflect-metadata";
import * as React from "react";
import { expect } from "chai";
import Enzyme, { shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import sinon, { SinonSpy } from "sinon";

import { DirectoryItem } from "components/blocks";
import { IDirectoryItemProps } from "props/blocks";
import { IAppContext, IDirectoryItem } from "models";
import { ThemesManager } from "objects/managers";

Enzyme.configure({ adapter: new Adapter() });

describe("<DirectoryItem />", () => {
    let context: IAppContext;
    let props: IDirectoryItemProps;
    let component: React.ReactElement<IDirectoryItemProps>;

    let directoryModel: IDirectoryItem;

    let renderSpy: SinonSpy;

    before(() => {
        context = {
            theme: ThemesManager.fake()
        };

        directoryModel = {
            name: "item.txt",
            path: "/path/to/",
            isDirectory: false,
            isHidden: false
        }
    });

    beforeEach(() => {
        props = {
            model: directoryModel,
            isSelected: false,
            isChosen: false,
            sendPathUp: (path: string) => { },
            sendSelectedItemUp: (selectedItem: IDirectoryItem) => { },
            sendDeletionUp: () => { }
        }
    });

    afterEach(() => {
        renderSpy && renderSpy.restore();
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
        renderSpy = sinon.spy(DirectoryItem.prototype, "render");
        shallow(component, { context });

        expect(renderSpy.callCount).to.equal(1);
    });

    it("renders only once when updated", () => {
        component = <DirectoryItem {...props} />;
        const wrapper = shallow(component, { context });
        renderSpy = sinon.spy(DirectoryItem.prototype, "render");
        wrapper.instance().forceUpdate();

        expect(renderSpy.callCount).to.equal(1);
    });
});
