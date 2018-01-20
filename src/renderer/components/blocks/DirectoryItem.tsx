import autobind from "autobind-decorator";
import { shell } from "electron";
import * as PropTypes from "prop-types";
import * as React from "react";
import { HotKeys } from "react-hotkeys";

import { IAppContext } from "models";
import { IDirectoryItemProps } from "props/blocks";
import Utils from "Utils";

import "styles/blocks/DirectoryItem.scss";

/** A single directory item component. */
class DirectoryItem extends React.PureComponent<IDirectoryItemProps> {

    /** Validation for context types. */
    public static contextTypes = {
        theme: PropTypes.object
    };

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
        const {
            fileColour,
            directoryColour,
            backgroundColour,
            chosenColour,
            selectedColour
        } = this.context.theme.directoryItem;
        const style: React.CSSProperties = {
            color: (this.props.isChosen ? chosenColour :
                (!model.isDirectory && fileColour) ||
                (model.isDirectory && directoryColour)) ||
                "inherit",
            backgroundColor: isSelected ? selectedColour : backgroundColour || "inherit",
            border: "none"
        };

        return <HotKeys
            handlers={this.handlers}
            ref={component => component && isSelected && Utils.autoFocus(component)}>
            <div
                className={`DirectoryItem ${selectedClass}`}>
                <button
                    style={style}
                    onClick={this.select}
                    onDoubleClick={this.activate}>
                    {model.name}
                </button>
            </div>
        </HotKeys>;
    }

    /** Handles sending up the directory's path to the parent component. */
    @autobind
    private openDirectory() {
        if (this.props.model.isDirectory) {
            this.props.sendPathUp(this.props.model.path);
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
            Utils.trace("Opening item using shell");
            shell.openItem(this.props.model.path);
        }
    }

    /**
     * Handles revealing the currently selected directory item in the system's
     * native file explorer.
     */
    @autobind
    private openInNativeExplorer() {
        Utils.trace("Showing item in folder using shell");
        shell.showItemInFolder(this.props.model.path);
    }

    /** Handles selecting the current directory item. */
    @autobind
    private select() {
        this.props.sendSelectedItemUp(this.props.model);
    }
}

export default DirectoryItem;
