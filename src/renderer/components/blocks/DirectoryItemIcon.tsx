import FileIcons from "file-icons-js";
import * as React from "react";
import { FaFileO, FaFolderO } from "react-icons/lib/fa";

import { IDirectoryItemIconProps } from "props/blocks";

import "styles/blocks/DirectoryItemIcon.scss";

/** An icon for a directory item. */
class DirectoryItemIcon extends React.PureComponent<IDirectoryItemIconProps> {

    /**
     * Defines how the directory item icon is rendered.
     *
     * @returns - a JSX element representing the directory item icon
     */
    public render(): JSX.Element {
        const { directoryItem, theme } = this.props;

        if (directoryItem.isDirectory) {
            return <FaFolderO color={theme.directoryItem.directoryIconColour} />;
        } else {
            const className = FileIcons.getClassWithColor(directoryItem.path);

            return className === null ? <FaFileO color={theme.directoryItem.fileIconDefaultColour} /> :
                <i className={className}></i>;
        }
    }
}

export default DirectoryItemIcon;
