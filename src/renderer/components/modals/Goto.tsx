import autobind from "autobind-decorator";
import path from "path";
import * as React from "react";

import { QuickSelect } from "components/modals";
import { IDirectoryItem } from "models";
import { IGotoProps } from "props/modals";
import { IGotoState } from "states/modals";
import Utils from "Utils";

/** A Goto component for quickly searching the file system. */
class Goto extends React.Component<IGotoProps, IGotoState> {

    /**
     * Instantiates a new Goto component.
     *
     * @param props the properties for the Goto
     */
    public constructor(props: IGotoProps) {
        super(props);

        this.state = {
            currentDirectory: this.props.initialPath,
            directoryItems: [],
            searchTerm: this.props.initialPath
        };
    }

    /**
     * Handles fetching the directory items to display after the component
     * mounts.
     */
    public async componentDidMount() {
        const nonHiddenDirectoryFolders = await this.getNonHiddenFolders(this.state.currentDirectory);

        this.setState({ directoryItems: nonHiddenDirectoryFolders } as IGotoState);
    }

    /**
     * Clears the quickSelectDefaultValue in state if it was not undefined.
     */
    public componentDidUpdate() {
        if (this.state.quickSelectValue) {
            this.setState({ quickSelectValue: undefined } as IGotoState);
        }
    }

    /**
     * Defines how the goto component is rendered.
     *
     * @returns a JSX element representing the goto view
     */
    public render(): JSX.Element {
        return <QuickSelect
            isOpen={this.props.isOpen}
            onClose={this.props.onClose}
            initialItems={this.renderItems()}
            onKeyUp={this.handleKeyUp}
            onSelect={this.handleSelect}
            inputValue={this.state.quickSelectValue}
            onUpdate={this.handleUpdate}
            theme={this.props.theme} />;
    }

    /**
     * Renders the items passed to the Goto's QuickSelect.
     *
     * @returns a list of rendered items to be passed to the QuickSelect
     */
    private renderItems(): JSX.Element[] {
        const shownItems = Utils.fuzzySearchItems<IDirectoryItem>(
            this.state.searchTerm,
            this.state.directoryItems,
            item => item.path);

        const defaultItem: IDirectoryItem = {
            accessible: true,
            created: new Date(),
            isDirectory: true,
            isHidden: false,
            lastModified: new Date(),
            name: path.basename(this.state.currentDirectory),
            path: this.state.currentDirectory
        };

        shownItems.unshift(defaultItem);

        return shownItems
            .map(item => {
                const itemStyles: React.CSSProperties = {
                    color: !item.accessible && this.props.theme.directoryItem.inaccessibleColour
                };

                return <li key={item.path} value={item.path} style={itemStyles}>{item.path}</li>;
            });
    }

    /**
     * Handles interpreting the key entered in the search field.
     *
     * @param event a keyboard event fired when a user finishes pressing a key
     */
    @autobind
    private async handleKeyUp(event: React.KeyboardEvent<HTMLInputElement>) {
        if (event.key === "up" || event.key === "down") {
            return;
        }

        const newPath = (event.target as HTMLInputElement).value;

        /*
         * If the user deletes a path.sep character, the current directory is
         * updated by taking the dirname of the search term.
         */
        if (event.key === "Backspace" && this.state.searchTerm.endsWith(path.sep)) {
            await this.handleNavigateUp(newPath);

            /*
             * If path.sep is entered, the search term becomes the new current
             * directory.
             */
        } else if (event.key === path.sep) {
            await this.handleNavigateIn(newPath);

        } else {
            this.setState({ searchTerm: newPath });
        }
    }

    /**
     * Handles navigating up a directory when the user deletes a path.sep character
     *
     * @param newPath the new path entered in the GoTo's input field
     */
    private async handleNavigateUp(newPath: string) {
        const basePath = path.dirname(this.state.searchTerm);
        const nonHiddenDirectoryItems = await this.getNonHiddenFolders(basePath);

        this.setState(
            {
                currentDirectory: basePath,
                directoryItems: nonHiddenDirectoryItems,
                searchTerm: newPath
            });
    }

    /**
     * Handles navigating into a directory when the user enters a path.sep character
     *
     * @param newPath the new path entered in the GoTo's input field
     */
    private async handleNavigateIn(newPath: string) {
        const strippedPath = newPath.endsWith(path.sep) ? newPath.substr(0, newPath.lastIndexOf(path.sep)) : newPath;
        const directoryToNavigateInto = this.state.directoryItems.find(item => item.path === strippedPath)!;
        if (!directoryToNavigateInto.accessible) {
            return;
        }

        const nonHiddenDirectoryItems = await this.getNonHiddenFolders(newPath);

        this.setState(
            {
                currentDirectory: newPath,
                directoryItems: nonHiddenDirectoryItems,
                searchTerm: newPath
            });
    }

    /**
     * Returns non-hidden child folders of the basePath.
     *
     * @param basePath - the directory in which to return child folders
     *
     * @returns non-hidden child folders of the basePath
     */
    private async getNonHiddenFolders(basePath: string): Promise<IDirectoryItem[]> {
        return this.props.directoryManager.listDirectory(
            basePath,
            {
                filterCondition: item => item.isDirectory && !item.isHidden,
                hideUnixStyleHiddenItems: this.props.settingsManager.settings.windows.hideUnixStyleHiddenItems
            }
        );
    }

    /**
     * Handles selecting an item and closing the goto modal.
     *
     * @param selectedItem the selected item
     */
    @autobind
    private handleSelect(selectedItem: string) {
        const directoryToNavigateInto = this.state.directoryItems.find(item => item.path === selectedItem)!;
        if (!directoryToNavigateInto.accessible) {
            return;
        }

        this.props.navigateTo(selectedItem);

        this.props.onClose();
    }

    /**
     * Handles updating the goto based on the user's choice of selectedItem.
     *
     * @param selectedItem the selected item
     */
    @autobind
    private async handleUpdate(selectedItem: string) {
        const newDirectoryItems = await this.getNonHiddenFolders(selectedItem);

        this.setState(
            {
                directoryItems: newDirectoryItems,
                quickSelectValue: `${selectedItem}${path.sep}`
            } as IGotoState);
    }
}

export default Goto;
