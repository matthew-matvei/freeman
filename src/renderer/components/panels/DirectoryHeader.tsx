import * as React from "react";
import SplitPane from "react-split-pane";

import { IDirectoryHeaderProps } from "props/panels";

import "styles/panels/DirectoryHeader.scss";

class DirectoryHeader extends React.PureComponent<IDirectoryHeaderProps> {

    private readonly divisors = {
        half: 2,
        quarter: 4
    };

    private container?: HTMLDivElement | null;

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

    public render(): JSX.Element {
        const splitPaneStyles: React.CSSProperties = {
            position: "relative"
        };

        return <div className="DirectoryHeader" ref={element => this.container = element}>
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
