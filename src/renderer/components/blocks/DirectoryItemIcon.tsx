import fileIcons from "file-icons-js";
import * as React from "react";
import { FaFileO, FaFolderO } from "react-icons/lib/fa";

import LoggedError from "errors/LoggedError";
import { IDirectoryItemIconProps } from "props/blocks";

import "styles/blocks/DirectoryItemIcon.scss";

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

        if (directoryItem && directoryItem.isDirectory || directoryItemType === "folder") {
            return <FaFolderO style={this.iconStyles} color={theme.directoryItem.directoryIconColour} />;
        }

        if (directoryItem && !directoryItem.isDirectory || directoryItemType === "file") {
            const className = directoryItem && fileIcons.getClassWithColor(directoryItem.path);

            return className ? <i style={this.iconStyles} className={className}></i> :
                <FaFileO style={this.iconStyles} color={theme.directoryItem.fileIconDefaultColour} />;
        }

        throw new LoggedError("Tried to render directory item icon with no valid prop");
    }
}

export default DirectoryItemIcon;
