import * as React from "react";
import path from "path";
import autobind from "autobind-decorator";

import { DirectoryItem } from "components/blocks";
import { IDirectoryPaneState } from "states/panels";
import { DirectoryReader } from "models";

/**
 * The component for displaying directory content.
 */
class DirectoryPane extends React.Component<{}, IDirectoryPaneState> {

    /**
     * Instantiates the DirectoryPane component.
     *
     * @param props - the properties for the DirectoryPane component
     */
    public constructor(props: {}) {
        super(props);

        this.state = {
            path: "/home/drumstix",
            files: [],
            folders: []
        }
    }

    /**
     * Updates the directory contents prior to loading the component.
     *
     * @param nextprops - the incoming props object
     */
    public async componentWillMount() {
        this.setState({ files: await DirectoryReader.ListDirectory(this.state.path) });
    }

    /**
     * Updates the directory contents prior to updating the component.
     *
     * @param nextProps - the incoming props object
     * @param nextState - the incoming state object
     */
    public async componentWillUpdate(nextProps: {}, nextState: IDirectoryPaneState) {
        this.setState({ files: await DirectoryReader.ListDirectory(nextState.path) });
    }

    /**
     * Defines how the directory pane component is rendered
     *
     * @returns - a JSX element representing the directory view
     */
    public render(): JSX.Element {
        const files = this.state.files.map((fileName, i) => {
            const filePath = path.join(this.state.path, fileName);

            return <DirectoryItem
                key={filePath}
                path={filePath}
                name={fileName}
                isDirectory
                isSelected={i === 0}
                sendPathUp={this.updatePath} />;
        });

        return <ul>{files}</ul>;
    }

    /**
     * Updates the path of the directory this DirectoryPane represents.
     *
     * @param path - the path to the new directory
     */
    @autobind
    private updatePath(path: string) {
        this.setState({ path: path } as IDirectoryPaneState)
    }
}

export default DirectoryPane;
