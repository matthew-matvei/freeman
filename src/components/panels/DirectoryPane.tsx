import * as React from "react";
import path from "path";
import autobind from "autobind-decorator";

import { DirectoryItem } from "components/blocks";
import { IDirectoryItem } from "models";
import { DirectoryReader } from "models";
import { IDirectoryPaneState } from "states/panels";

/**
 * The component for displaying directory content.
 */
class DirectoryPane extends React.Component<{}, IDirectoryPaneState> {

    /**
     * The items within this directory (files, folders etc.).
     */
    private directoryItems: IDirectoryItem[];

    /**
     * Instantiates the DirectoryPane component.
     *
     * @param props - the properties for the DirectoryPane component
     */
    public constructor(props: {}) {
        super(props);

        this.state = { path: "/home/drumstix" };

        this.directoryItems = [];
    }

    /**
     * Updates the directory contents prior to loading the component.
     *
     * @param nextprops - the incoming props object
     */
    public componentWillMount() {
        this.directoryItems = DirectoryReader.ListDirectory(this.state.path);
    }

    /**
     * Updates the directory contents prior to updating the component.
     *
     * @param nextProps - the incoming props object
     */
    public componentWillUpdate(nextProps: {}, nextState: IDirectoryPaneState) {
        this.directoryItems = DirectoryReader.ListDirectory(nextState.path);
    }

    /**
     * Defines how the directory pane component is rendered
     *
     * @returns - a JSX element representing the directory view
     */
    public render(): JSX.Element {
        const files = this.directoryItems.map((file, i) => {
            const filePath = path.join(this.state.path, file.name);

            return <DirectoryItem
                key={filePath}
                path={filePath}
                name={file.name}
                isDirectory={file.isDirectory}
                isSelected={i === 0}
                sendPathUp={this.updatePath} />;
        });

        return <ul>{files}</ul>;
    }

    /**
     * Updates the path held in the directory pane's state
     *
     * @param path - the path to update to
     */
    @autobind
    private updatePath(path: string) {
        this.setState({ path: path });
    }
}

export default DirectoryPane;
