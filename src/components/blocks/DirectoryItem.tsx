import * as React from "react";
import autobind from "autobind-decorator";

import { IDirectoryItemProps } from "props/blocks";

import "styles/blocks/directoryitem.scss";

/**
 * A single directory item component.
 */
class DirectoryItem extends React.Component<IDirectoryItemProps, {}> {

    /**
     * Defines how the directory item component is rendered
     *
     * @returns - a JSX element representing the directory item view
     */
    public render(): JSX.Element {
        return <div
            className="DirectoryItem">
            <button onClick={this.handleClick}>{this.props.name}</button>
        </div>;
    }

    /**
     * Handles sending up the directory's path on click.
     */
    @autobind
    private handleClick() {
        if (this.props.isDirectory) {
            this.props.sendPathUp(this.props.path)
        }
    }
}

export default DirectoryItem;
