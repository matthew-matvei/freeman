import * as React from "react";
import * as PropTypes from "prop-types";
import { shell } from "electron";
import autobind from "autobind-decorator";
import { HotKeys } from "react-hotkeys";

import { IDirectoryItemProps } from "props/blocks";
import { IAppContext } from "models";
import { autoFocus } from "utils";

import "styles/blocks/DirectoryItem.scss";

/** A single directory item component. */
class DirectoryItem extends React.PureComponent<IDirectoryItemProps> {

    /** Validation for context types. */
    public static contextTypes = {
        theme: PropTypes.object
    }

    /** The global application context. */
    public context: IAppContext;

    /** Handler functions for the given events this component handles. */
    private handlers = {
        openDirectory: this.openDirectory,
        activate: this.activate,
        openInNativeExplorer: this.openInNativeExplorer
    };

    /**
     * Defines how the directory item component is rendered.
     *
     * @returns - a JSX element representing the directory item view
     */
    public render(): JSX.Element {
        const { isSelected, model } = this.props;
        const selectedClass = isSelected ? "selected" : "";
        const { colour, backgroundColour, chosenColour, selectedColour } = this.context.theme.directoryItem;
        const style: React.CSSProperties = {
            color: (this.props.isChosen ? chosenColour : colour) || "inherit",
            backgroundColor: isSelected ? selectedColour : backgroundColour || "inherit",
            border: "none"
        };

        return <HotKeys
            handlers={this.handlers}
            ref={component => component && isSelected && autoFocus(component)}>
            <div onClick={this.select} className={`DirectoryItem ${selectedClass}`}>
                <button style={style} onDoubleClick={this.openDirectory}>
                    {model.name}
                </button>
            </div>
        </HotKeys>;
    }

    /** Handles sending up the directory's path to the parent component. */
    @autobind
    private openDirectory() {
        if (this.props.model.isDirectory) {
            this.props.sendPathUp(this.props.model.path)
        }
    }

    /**
     * Handles activating the currently selected directory item using the system's
     * default program.
     */
    @autobind
    private activate() {
        if (this.props.model.isDirectory) {
            this.props.sendPathUp(this.props.model.path);
        } else {
            shell.openItem(this.props.model.path);
        }
    }

    /**
     * Handles revealing the currently selected directory item in the system's
     * native file explorer.
     */
    @autobind
    private openInNativeExplorer() {
        shell.showItemInFolder(this.props.model.path);
    }

    /** Handles selecting the current directory item. */
    @autobind
    private select() {
        this.props.sendSelectedItemUp(this.props.model);
    }


}

export default DirectoryItem;
