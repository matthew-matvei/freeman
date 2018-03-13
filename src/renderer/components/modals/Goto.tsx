import autobind from "autobind-decorator";
import path from "path";
import * as React from "react";

import { QuickSelect } from "components/modals";
import { IGotoProps } from "props/modals";
import { IGotoState } from "states/modals";
import Utils from "Utils";

/** A Goto component for quickly searching the file system. */
class Goto extends React.Component<IGotoProps, IGotoState> {

    /**
     * Instantiates a new Goto component.
     *
     * @param propsthe properties for the Goto
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
        const nonHiddenDirectoryFolders = await this.props.directoryManager.listDirectory(
            this.state.currentDirectory,
            {
                filterCondition: item => item.isDirectory && !item.isHidden,
                hideUnixStyleHiddenItems: this.props.settingsManager.settings.windows.hideUnixStyleHiddenItems
            }
        );

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
     * @returnsa JSX element representing the goto view
     */
    public render(): JSX.Element {
        const items = this.state.directoryItems.map(item => item.path);
        const shownItems = Utils.fuzzySearchItems(this.state.searchTerm, items);
        shownItems.unshift(this.state.currentDirectory);

        return <QuickSelect
            isOpen={this.props.isOpen}
            onClose={this.props.onClose}
            initialItems={shownItems}
            onKeyUp={this.handleKeyUp}
            onSelect={this.handleSelect}
            inputValue={this.state.quickSelectValue}
            onUpdate={this.handleUpdate}
            theme={this.props.theme} />;
    }

    /**
     * Handles interpreting the key entered in the search field.
     *
     * @param eventa keyboard event fired when a user finishes pressing a key
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
            const basePath = path.dirname(this.state.searchTerm);
            const nonHiddenDirectoryItems = await this.props.directoryManager.listDirectory(
                basePath,
                {
                    filterCondition: item => item.isDirectory && !item.isHidden,
                    hideUnixStyleHiddenItems: this.props.settingsManager.settings.windows.hideUnixStyleHiddenItems
                }
            );

            this.setState(
                {
                    currentDirectory: basePath,
                    directoryItems: nonHiddenDirectoryItems,
                    searchTerm: newPath
                });
            /*
             * If path.sep is entered, the search term becomes the new current
             * directory.
             */
        } else if (event.key === path.sep) {
            const nonHiddenDirectoryItems = await this.props.directoryManager.listDirectory(
                newPath,
                {
                    filterCondition: item => item.isDirectory && !item.isHidden,
                    hideUnixStyleHiddenItems: this.props.settingsManager.settings.windows.hideUnixStyleHiddenItems
                }
            );

            this.setState(
                {
                    currentDirectory: newPath,
                    directoryItems: nonHiddenDirectoryItems,
                    searchTerm: newPath
                });
        } else {
            this.setState({ searchTerm: newPath });
        }
    }

    /**
     * Handles selecting an item and closing the goto modal.
     *
     * @param selectedItemthe selected item
     */
    @autobind
    private handleSelect(selectedItem: string) {
        this.props.navigateTo(selectedItem);

        this.props.onClose();
    }

    /**
     * Handles updating the goto based on the user's choice of selectedItem.
     *
     * @param selectedItemthe selected item
     */
    @autobind
    private async handleUpdate(selectedItem: string) {
        const newDirectoryItems = await this.props.directoryManager.listDirectory(selectedItem,
            {
                filterCondition: item => item.isDirectory && !item.isHidden,
                hideUnixStyleHiddenItems: this.props.settingsManager.settings.windows.hideUnixStyleHiddenItems
            }
        );

        this.setState(
            {
                directoryItems: newDirectoryItems,
                quickSelectValue: `${selectedItem}${path.sep}`
            } as IGotoState);
    }
}

export default Goto;
