import * as React from "react";
import SplitPane from "react-split-pane";

import "styles/panels/DirectoryHeader.scss";

class DirectoryHeader extends React.Component {

    public render(): JSX.Element {
        const splitPaneStyles: React.CSSProperties = {
            position: "relative"
        };

        return <div className="DirectoryHeader">
            <SplitPane style={splitPaneStyles}>
                <div>Name</div>
                <SplitPane>
                    <div>Size</div>
                    <div>Modified on</div>
                </SplitPane>
            </SplitPane>
        </div>;
    }
}

export default DirectoryHeader;
