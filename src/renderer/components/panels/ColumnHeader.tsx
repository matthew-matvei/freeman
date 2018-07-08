import autobind from "autobind-decorator";
import React from "react";
import SplitPane from "react-split-pane";

import { IColumnHeaderProps } from "props/panels";

class ColumnHeader extends React.PureComponent<IColumnHeaderProps> {

    public render(): JSX.Element {
        return <SplitPane
            style={this.props.columnStyles}
            size={this.props.columnSize}
            onChange={this.handleChange}>
            <div>{this.props.heading}</div>
            {this.props.children}
        </SplitPane>;
    }

    @autobind
    private handleChange(newSize: number) {
        this.props.onChange(newSize, this.props.columnType);
    }
}

export default ColumnHeader;
