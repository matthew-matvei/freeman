import autobind from "autobind-decorator";
import React from "react";
import SplitPane from "react-split-pane";

import { IColumnHeaderProps } from "props/panels";

/** A component acting as a header at the top of each column. */
class ColumnHeader extends React.PureComponent<IColumnHeaderProps> {

    /**
     * Defines how the column header component is rendered
     *
     * @returns a JSX element representing the column header view
     */
    public render(): JSX.Element {
        return <SplitPane
            style={this.props.columnStyles}
            size={this.props.columnSize}
            onChange={this.handleChange}>
            <div>{this.props.heading}</div>
            {this.props.children}
        </SplitPane>;
    }

    /**
     * Handles updating the column size on change of the split pane's size.
     *
     * @param newSize the size to update the column to
     */
    @autobind
    private handleChange(newSize: number) {
        this.props.onChange(newSize, this.props.columnType);
    }
}

export default ColumnHeader;
