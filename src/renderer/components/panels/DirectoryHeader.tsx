import * as React from "react";
import SplitPane from "react-split-pane";

import { IDirectoryHeaderState } from "states/panels";

import "styles/panels/DirectoryHeader.scss";

class DirectoryHeader extends React.Component<{}, IDirectoryHeaderState> {

    private readonly divisors = {
        half: 2,
        quarter: 4
    };

    private container?: HTMLDivElement | null;

    public constructor(props: {}) {
        super(props);

        this.state = {
            columnSizes: {
                lastModified: 50,
                name: 50,
                size: 50
            }
        };
    }

    public componentDidMount() {
        if (!this.container) {
            return;
        }

        this.setState({
            columnSizes: {
                lastModified: this.container.clientWidth / this.divisors.quarter,
                name: this.container.clientWidth / this.divisors.half,
                size: this.container.clientWidth / this.divisors.quarter
            }
        } as IDirectoryHeaderState);
    }

    public render(): JSX.Element {
        const splitPaneStyles: React.CSSProperties = {
            position: "relative"
        };

        return <div className="DirectoryHeader" ref={element => this.container = element}>
            <SplitPane
                allowResize={false}
                style={splitPaneStyles}
                size={this.state.columnSizes.name}>
                <div>Name</div>
                <SplitPane
                    allowResize={false}
                    size={this.state.columnSizes.size}>
                    <div>Size</div>
                    <div>Modified on</div>
                </SplitPane>
            </SplitPane>
        </div>;
    }
}

export default DirectoryHeader;
