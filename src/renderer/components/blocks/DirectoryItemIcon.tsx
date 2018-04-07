import fileIcons from "file-icons-js";
import * as React from "react";
import { FaFileO, FaFolderO } from "react-icons/lib/fa";

import LoggedError from "errors/LoggedError";
import { IDirectoryItemIconProps } from "props/blocks";

import "styles/blocks/DirectoryItemIcon.scss";
import { ItemType } from "types";

/** An icon for a directory item. */
class DirectoryItemIcon extends React.PureComponent<IDirectoryItemIconProps> {

    /** Defines a static width for all directory item icons to ensure correct alignment. */
    private readonly iconStyles: React.CSSProperties = {
        width: "22px"
    };

    /**
     * Defines how the directory item icon is rendered.
     *
     * @returns a JSX element representing the directory item icon
     */
    public render(): JSX.Element {
        const { directoryItem, directoryItemType, theme } = this.props;
        const { directoryItemIcon } = theme;

        if (directoryItem && directoryItem.isDirectory || directoryItemType === "folder") {
            return <FaFolderO
                style={this.iconStyles}
                color={this.getIconColour("folder")} />;
        }

        if (directoryItem && !directoryItem.isDirectory || directoryItemType === "file") {
            const className = directoryItem && fileIcons.getClassWithColor(directoryItem.path);

            return className ?
                <i style={this.iconStyles}
                    color={(directoryItem &&
                        !directoryItem.accessible &&
                        directoryItemIcon.inaccessibleIconColour) || undefined}
                    className={className}></i> :
                <FaFileO
                    style={this.iconStyles}
                    color={this.getIconColour("file")} />;
        }

        throw new LoggedError("Tried to render directory item icon with no valid prop");
    }

    /**
     * Gets the desired colour of the icon.
     *
     * @param itemType the type of the directory item
     *
     * @returns the desired colour of the icon
     */
    private getIconColour(itemType: ItemType): string | undefined {
        const { directoryItem, theme } = this.props;

        if (itemType === "folder") {
            return directoryItem && directoryItem.accessible ?
                theme.directoryItemIcon.directoryIconColour : theme.directoryItemIcon.inaccessibleIconColour;
        }

        return directoryItem && directoryItem.accessible ?
            theme.directoryItemIcon.fileIconDefaultColour : theme.directoryItemIcon.inaccessibleIconColour;
    }
}

export default DirectoryItemIcon;
