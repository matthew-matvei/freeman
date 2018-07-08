import autobind from "autobind-decorator";
import * as React from "react";

import { ColumnHeader } from "components/panels";
import { IDirectoryHeaderProps } from "props/panels";
import { ColumnType } from "types";

import "styles/panels/DirectoryHeader.scss";

/** The DirectoryHeader component. */
class DirectoryHeader extends React.PureComponent<IDirectoryHeaderProps> {

    /** Divisors to use when calculating column widths. */
    private readonly divisors = {
        half: 2,
        sixth: 6
    };

    /** The parent container used for calculating column widths. */
    private container?: HTMLDivElement | null;

    /** @inheritDoc */
    public componentDidMount() {
        if (!this.container) {
            return;
        }

        const containerWidth = this.container.clientWidth;

        this.props.updateColumnSize("name", containerWidth / this.divisors.half);
        this.props.updateColumnSize("size", containerWidth / this.divisors.sixth);
        this.props.updateColumnSize("lastModified", containerWidth / this.divisors.sixth);
    }

    /**
     * Defines how the directory header component is rendered.
     *
     * @returns a JSX element representing the directory header view
     */
    public render(): JSX.Element {
        const directoryHeaderStyles: React.CSSProperties = {
            background: this.props.theme.directoryHeader.backgroundColour,
            boxShadow: `0 5px 5px ${this.props.theme.directoryItem.backgroundColour}`,
            color: this.props.theme.directoryHeader.foregroundColour
        };

        const splitPaneStyles: React.CSSProperties = {
            position: "relative"
        };

        return <div
            className="DirectoryHeader"
            style={directoryHeaderStyles}
            ref={element => this.container = element}>
            <ColumnHeader
                heading="Name"
                columnType="name"
                columnStyles={splitPaneStyles}
                columnSize={this.props.columnSizes.name}
                onChange={this.handleSizeChange}>
                <ColumnHeader
                    heading="Size"
                    columnType="size"
                    columnSize={this.props.columnSizes.size}
                    onChange={this.handleSizeChange}>
                    <ColumnHeader
                        heading="Modified on"
                        columnType="lastModified"
                        columnSize={this.props.columnSizes.lastModified}
                        onChange={this.handleSizeChange}>
                        <div>Created on</div>
                    </ColumnHeader>
                </ColumnHeader>
            </ColumnHeader>
        </div>;
    }

    @autobind
    private handleSizeChange(newSize: number, columnType: ColumnType) {
        this.props.updateColumnSize(columnType, newSize);
    }
}

export default DirectoryHeader;
