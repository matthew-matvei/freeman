import * as React from "react";
import * as ReactDOM from "react-dom";
import autobind from "autobind-decorator";
import { HotKeys } from "react-hotkeys";

import { IDirectoryItemProps } from "props/blocks";

import "styles/blocks/directoryitem.scss";

/**
 * A single directory item component.
 */
class DirectoryItem extends React.Component<IDirectoryItemProps, {}> {

    /**
     * Handler functions for the given events this component handles.
     */
    private handlers = {
        openDirectory: this.openDirectory
    };

    /**
     * Defines how the directory item component is rendered
     *
     * @returns - a JSX element representing the directory item view
     */
    public render(): JSX.Element {
        const item = <div className="DirectoryItem">
            <button onDoubleClick={this.openDirectory}>{this.props.model.name}</button>
        </div>;

        return this.props.isSelected ?
            <HotKeys handlers={this.handlers} ref={(component) => component && this.autoFocus(component)}>
                {item}
            </HotKeys> : <HotKeys handlers={this.handlers}>
                {item}
            </HotKeys>;
    }

    /**
     * Handles sending up the directory's path to the parent component.
     */
    @autobind
    private openDirectory() {
        if (this.props.model.isDirectory) {
            this.props.sendPathUp(this.props.model.path)
        }
    }

    /**
     * Handles focusing the appropriate directory item automatically.
     *
     * @param component - the HotKeys wrapper component to call focus on
     */
    private autoFocus(component: HotKeys) {
        (ReactDOM.findDOMNode(component) as HTMLElement).focus();
    }
}

export default DirectoryItem;
