import { expect } from "chai";
import Enzyme, { shallow } from "enzyme";
import ReactSixteenAdapter from "enzyme-adapter-react-16";
import * as React from "react";
import SplitPane, { Props as SplitPaneProps } from "react-split-pane";
import "reflect-metadata";
import Sinon, { SinonStub } from "sinon";

import { ColumnHeader } from "components/panels";
import { IColumnHeaderProps } from "props/panels";

Enzyme.configure({ adapter: new ReactSixteenAdapter() });

describe("The <ColumnHeader /> component", () => {
    let onChangeMock: SinonStub;
    let props: IColumnHeaderProps;
    let component: React.ReactElement<IColumnHeaderProps>;

    const sandbox = Sinon.createSandbox();

    beforeEach(() => {
        onChangeMock = sandbox.stub();

        props = {
            columnSize: 50,
            columnType: "name",
            heading: "Test Column",
            onChange: onChangeMock
        };

        component = <ColumnHeader {...props} />;
    });

    it("handles updating the size of the column on change of the split pane", () => {
        const wrapper = shallow(component);
        const splitPane = wrapper.find(SplitPane);
        const splitPaneProps = splitPane.props() as SplitPaneProps;
        splitPaneProps.onChange!(props.columnSize * 2);

        expect(onChangeMock.calledOnce).to.be.true;
    });
});
