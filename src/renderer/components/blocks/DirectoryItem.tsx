import * as React from "react";
import * as ReactDOM from "react-dom";
import * as PropTypes from "prop-types";
import { shell } from "electron";
import autobind from "autobind-decorator";
import { HotKeys } from "react-hotkeys";
import { remote } from "electron";
const dialog = remote.dialog;

import { IDirectoryItemProps } from "props/blocks";
import { IAppContext } from "models";
import { DirectoryManager } from "objects";

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
        openInNativeExplorer: this.openInNativeExplorer,
        sendToTrash: this.sendToTrash,
        delete: this.deleteItem
    };

    /**
     * Defines how the directory item component is rendered
     *
     * @returns - a JSX element representing the directory item view
     */
    public render(): JSX.Element {
        const { isSelected, model } = this.props;
        const selectedClass = isSelected ? "selected" : "";
        const { colour, backgroundColour, selectedColour } = this.context.theme.directoryItem;
        const style: React.CSSProperties = {
            color: colour || "inherit",
            backgroundColor: isSelected ? selectedColour : backgroundColour || "inherit",
            border: "none"
        };

        return <HotKeys
            handlers={this.handlers}
            ref={component => component && isSelected && this.autoFocus(component)}>
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

    /**
     * Handles providing a dialog to the user to confirm sending an item to the
     * trash.
     */
    @autobind
    private sendToTrash() {
        if (this.props.model.isDirectory) {
            return;
        }

        const confirmTrash = this.confirmationDialog(
            "Are you sure you want to send this item to trash?");

        if (confirmTrash) {
            DirectoryManager.sendItemToTrash(this.props.model.path).then(onfulfilled => {
                this.props.sendDeletionUp();
            });
        }
    }

    /**
     * Handles providing a dialog to the user to confirm deletion of an item.
     */
    @autobind
    private deleteItem() {
        const confirmDelete = this.confirmationDialog(
            "Are you sure you want to permanently delete this item?");

        if (confirmDelete) {
            DirectoryManager.deleteItem(
                this.props.model.path,
                this.props.model.isDirectory ? "folder" : "file").then(onfulfilled => {
                    this.props.sendDeletionUp();
                });
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

    /**
     * Displays a dialog and returns whether the user confirmed the action described
     * in the given message.
     *
     * @param message - the message to display to the user
     *
     * @returns - whether the user confirmed the described action
     */
    private confirmationDialog(message: string): boolean {
        const confirmIndex = 0;
        const cancelIndex = 1;
        const confirmation = dialog.showMessageBox({
            type: "warning",
            buttons: ["OK", "Cancel"],
            defaultId: cancelIndex,
            cancelId: cancelIndex,
            title: "Confirm deletion",
            message: message
        });

        return confirmation === confirmIndex;
    }
}

export default DirectoryItem;
