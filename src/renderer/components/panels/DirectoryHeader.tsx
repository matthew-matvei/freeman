import * as React from "react";
import SplitPane from "react-split-pane";

import { ColumnHeader } from "components/panels";
import { IDirectoryHeaderProps } from "props/panels";

import "styles/panels/DirectoryHeader.scss";

/** The DirectoryHeader component. */
class DirectoryHeader extends React.PureComponent<IDirectoryHeaderProps> {

    /** Divisors to use when calculating column widths. */
    private readonly divisors = {
        half: 2,
        sixth: 6
    };

    private nameSplitPane: SplitPane | null = null;

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
        this.props.updateColumnSize("createdOn", containerWidth / this.divisors.sixth);
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
            <ColumnHeader heading="Name" columnStyles={splitPaneStyles} columnSize={this.props.columnSizes.name}>
                <ColumnHeader heading="Size" columnSize={this.props.columnSizes.size}>
                    <ColumnHeader heading="Modified on" columnSize={this.props.columnSizes.lastModified}>
                        <div>Created on</div>
                    </ColumnHeader>
                </ColumnHeader>
            </ColumnHeader>
        </div>;
    }

    private handleSizeChange(newSize: number) {
        if (this.nameSplitPane) { }
    }
}

export default DirectoryHeader;

