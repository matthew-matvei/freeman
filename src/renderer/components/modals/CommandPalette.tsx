import autobind from "autobind-decorator";
import * as React from "react";

import { QuickSelect } from "components/modals";
import { ICommandPaletteProps } from "props/modals";

/** The CommandPalette component, a QuickSelect for general commands. */
class CommandPalette extends React.Component<ICommandPaletteProps, {}> {

    /**
     * Defines how the command palette component is rendered.
     *
     * @returns - a JSX element representing the command palette view
     */
    public render(): JSX.Element {
        const itemKeys = Object.keys(this.props.applicationCommands);

        return <QuickSelect
            isOpen={this.props.isOpen}
            onClose={this.props.onClose}
            initialItems={itemKeys}
            onSelect={this.handleSelect} />;
    }

    /**
     * Handles invoking the command chosen in the QuickSelect.
     *
     * @param selectedItem - the item selected in the QuickSelect
     */
    @autobind
    private handleSelect(selectedItem: string) {
        this.props.applicationCommands[selectedItem]();
    }
}

export default CommandPalette;
