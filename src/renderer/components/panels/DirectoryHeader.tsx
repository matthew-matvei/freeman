import * as React from "react";
import SplitPane from "react-split-pane";

import { IDirectoryHeaderProps } from "props/panels";

import "styles/panels/DirectoryHeader.scss";

/** The DirectoryHeader component. */
class DirectoryHeader extends React.PureComponent<IDirectoryHeaderProps> {

    /** Divisors to use when calculating column widths. */
    private readonly divisors = {
        half: 2,
        quarter: 4
    };

    /** The parent container used for calculating column widths. */
    private container?: HTMLDivElement | null;

    /** @inheritDoc */
    public componentDidMount() {
        if (!this.container) {
            return;
        }

        const containerWidth = this.container.clientWidth;

        this.props.updateColumnSizes(
            containerWidth / this.divisors.half,
            containerWidth / this.divisors.quarter,
            containerWidth / this.divisors.quarter);
    }

    /**
     * Defines how the directory header component is rendered.
     *
     * @returns a JSX element representing the directory header view
     */
    public render(): JSX.Element {
        const directoryHeaderStyles: React.CSSProperties = {
            boxShadow: `0 5px 5px ${this.props.theme.directoryItem.backgroundColour}`
        };

        const splitPaneStyles: React.CSSProperties = {
            position: "relative"
        };

        return <div
            className="DirectoryHeader"
            style={directoryHeaderStyles}
            ref={element => this.container = element}>
            <SplitPane
                allowResize={false}
                style={splitPaneStyles}
                size={this.props.columnSizes.name}>
                <div>Name</div>
                <SplitPane
                    allowResize={false}
                    size={this.props.columnSizes.size}>
                    <div>Size</div>
                    <div>Modified on</div>
                </SplitPane>
            </SplitPane>
        </div>;
    }
}

export default DirectoryHeader;
