import * as React from "react";
import autobind from "autobind-decorator";

import { IInputItemProps } from "props/blocks";
import { IInputItemState } from "states/blocks";
import { HotKeys } from "react-hotkeys";

/**
 * The input component to create a new directory item.
 */
class InputItem extends React.Component<IInputItemProps, IInputItemState> {

    /**
     * Handler functions for the given events this component handles.
     */
    private handlers = {
        moveUp: () => { },
        moveDown: () => { },
        moveBack: () => { }
    }

    /**
     * A reference to this input element.
     */
    private input: HTMLInputElement | null;

    /**
     * Instantiates the InputItem component.
     *
     * @param props - the properties for the DirectoryPane component
     */
    public constructor(props: IInputItemProps) {
        super(props);

        this.state = {
            isInvalid: false
        }
    }

    /**
     * Sets the focus to this item immediately after mounting.
     */
    public componentDidMount() {
        this.input && this.input.focus();
    }

    /**
     *
     * @param nextProps -
     * @param nextState
     */
    public shouldComponentUpdate(nextProps: {}, nextState: IInputItemState): boolean {
        return this.state.isInvalid !== nextState.isInvalid;
    }

    /**
    * Defines how the input item component is rendered.
    *
    * @returns - a JSX element representing the directory view
    */
    public render(): JSX.Element {
        return <HotKeys handlers={this.handlers}>
            <input type="text"
                style={{ borderColor: this.state.isInvalid && "red" }}
                ref={input => this.input = input}
                onKeyUp={this.handleKeyUp} />
        </HotKeys>;
    }

    /**
     * Handles interpreting the input value on key up.
     *
     * @param event - an event raised on key up
     */
    @autobind
    private handleKeyUp(event: React.KeyboardEvent<HTMLInputElement>) {
        if (!this.input) {
            return;
        }

        if (!this.validate(this.input.value)) {
            this.setState({ isInvalid: true } as IInputItemState);
            return;
        } else {
            this.setState({ isInvalid: false } as IInputItemState);
        }

        if (this.props.sendUpCreateItem) {
            return this.handleCreate(event);
        } else if (this.props.sendUpRenameItem) {
            return this.handleRename(event);
        }

        console.error("No callback function passed to InputItem component");
    }

    /**
     * Handles sending a create item request up to the parent component.
     *
     * @param event - an event raised on key up
     *
     * @require - this.input && this.props.sendUpCreateItem
     */
    private handleCreate(event: React.KeyboardEvent<HTMLInputElement>) {
        if (event.key === "Enter") {
            return this.props.sendUpCreateItem!(this.input!.value, this.props.creatingItemType);
        } else if (event.key === "Escape") {
            return this.props.sendUpCreateItem!();
        }
    }

    /**
     * Handles sending a rename item request up to the parent component.
     *
     * @param event - an event raised on key up
     *
     * @require - this.input && this.props.sendUpRenameItem
     */
    private handleRename(event: React.KeyboardEvent<HTMLInputElement>) {
        if (event.key === "Enter") {
            if (this.props.thisItem) {
                return this.props.sendUpRenameItem!(this.props.thisItem.name, this.input!.value);
            } else {
                console.error("thisItem is not defined", this.props.thisItem);
            }
        } else if (event.key === "Escape") {
            return this.props.sendUpRenameItem!();
        }
    }

    /**
     * Validates the given content.
     *
     * @param content - the content to validate
     *
     * @returns - whether the given content is valid
     */
    private validate(content: string): boolean {
        if (!content) {
            return false;
        }

        if (this.props.otherItems.some(item => item.name === content)) {
            return false;
        }

        return true;
    }
}

export default InputItem;
