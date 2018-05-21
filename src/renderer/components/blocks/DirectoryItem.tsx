import autobind from "autobind-decorator";
import { shell } from "electron";
import formatter from "format-number";
import moment from "moment";
import * as React from "react";
import { HotKeys } from "react-hotkeys";

import { IDirectoryItemStyles, IHandlers } from "models";
import { IDirectoryItemProps } from "props/blocks";
import Utils from "Utils";

import { DirectoryItemIcon } from "components/blocks";
import "styles/blocks/DirectoryItem.scss";

/** A single directory item component. */
class DirectoryItem extends React.PureComponent<IDirectoryItemProps> {

    /** Handler functions for the given events this component handles. */
    private handlers: IHandlers = {
        activate: this.activate,
        openDirectory: this.openDirectory,
        openInNativeExplorer: this.openInNativeExplorer
    };

    /** Gets the size of the directory item rendered in Kilobytes. */
    private get sizeInKiloBytes(): string | undefined {
        if (!this.props.model.size) {
            return "";
        }

        const bytesInKiloByte = 1024;

        return formatter({ suffix: " Kb" })(Math.round(this.props.model.size / bytesInKiloByte));
    }

    /**
     * Defines how the directory item component is rendered.
     *
     * @returns a JSX element representing the directory item view
     */
    public render(): JSX.Element {
        const { isSelected, model } = this.props;
        const selectedClass = isSelected ? "selected" : "";

        const {
            backgroundStyle,
            nameColumnStyle,
            sizeColumnStyle,
            lastModifiedColumnStyle
        } = this.itemStyles;

        return <HotKeys
            handlers={this.handlers}
            ref={component => component && isSelected && Utils.autoFocus(component)}>
            <div
                className={`Item DirectoryItem ${selectedClass}`}
                style={backgroundStyle}>
                <DirectoryItemIcon directoryItem={this.props.model} theme={this.props.theme} />
                <button
                    style={nameColumnStyle}
                    onClick={this.select}
                    onDoubleClick={this.activate}>
                    {model.name}
                </button>
                <button
                    className="sizeColumn"
                    style={sizeColumnStyle}
                    onClick={this.select}
                    onDoubleClick={this.activate}>
                    {this.sizeInKiloBytes}
                </button>
                <button
                    className="lastModifiedColumn"
                    style={lastModifiedColumnStyle}
                    onClick={this.select}
                    onDoubleClick={this.activate}>
                    {moment(model.lastModified).format("HH:mm:ss - D MMM, Y")}
                </button>
            </div>
        </HotKeys>;
    }

    /** Gets the directory item styles based on the component's current props. */
    private get itemStyles(): IDirectoryItemStyles {
        const { isSelected, model } = this.props;
        const {
            fileColour,
            directoryColour,
            backgroundColour,
            chosenColour,
            selectedColour
        } = this.props.theme.directoryItem;

        const backgroundStyle: React.CSSProperties = {
            backgroundColor: isSelected ? selectedColour : backgroundColour
        };

        const nameColumnStyle: React.CSSProperties = {
            color: (this.props.isChosen ? chosenColour :
                (!model.isDirectory && fileColour) ||
                (model.isDirectory && directoryColour)),
            width: `${this.props.columnSizes.name}px`
        };

        const sizeColumnStyle: React.CSSProperties = {
            ...nameColumnStyle,
            width: `${this.props.columnSizes.size}px`
        };

        const lastModifiedColumnStyle: React.CSSProperties = {
            ...nameColumnStyle,
            width: `${this.props.columnSizes.lastModified}px`
        };

        return {
            backgroundStyle,
            lastModifiedColumnStyle,
            nameColumnStyle,
            sizeColumnStyle
        };
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
