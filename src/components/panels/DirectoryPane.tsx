import * as React from "react";

import { IDirectoryPaneProps } from "props/panels";
import { IDirectoryPaneState } from "states/panels";
import { DirectoryReader } from "models";

/**
 * The component for displaying directory content.
 */
class DirectoryPane extends React.Component<IDirectoryPaneProps, IDirectoryPaneState> {

    /**
     * Instantiates the DirectoryPane component.
     *
     * @param props - the properties for the DirectoryPane component
     */
    public constructor(props: IDirectoryPaneProps) {
        super(props);

        this.state = {
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
        this.setState({ files: await DirectoryReader.ListDirectory(this.props.path) });
    }

    /**
     * Updates the directory contents when given a different path.
     *
     * @param nextProps - the incomenting props object
     */
    public async componentWillReceiveProps(nextProps: IDirectoryPaneProps) {
        if (this.props.path === nextProps.path) {
            return;
        }

        this.setState({ files: await DirectoryReader.ListDirectory(nextProps.path) });
    }

    /**
     * Defines how the directory pane component is rendered
     *
     * @returns - a JSX element representing the directory view
     */
    public render(): JSX.Element {
        return <ul>
            {this.state.files && this.state.files.map(file => <li>{file}</li>)}
        </ul>;
    }
}

export default DirectoryPane;
