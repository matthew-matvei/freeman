import autobind from "autobind-decorator";
import * as React from "react";
import { HotKeys } from "react-hotkeys";

import { DirectoryItemIcon } from "components/blocks";
import LoggedError from "errors/LoggedError";
import { IHandlers } from "models";
import { IInputItemProps } from "props/blocks";
import { IInputItemState } from "states/blocks";

import "styles/blocks/InputItem.scss";

/** The input component to create a new directory item. */
class InputItem extends React.Component<IInputItemProps, IInputItemState> {

    /** Handler functions for the given events this component handles. */
    private handlers: IHandlers = {
        moveBack: () => { },
        moveDown: () => { },
        moveUp: () => { }
    };

    /** A reference to this input element. */
    private input?: HTMLInputElement | null;

    /**
     * Instantiates the InputItem component.
     *
     * @param propsthe properties for the DirectoryPane component
     */
    public constructor(props: IInputItemProps) {
        super(props);

        this.state = {
            isInvalid: false
        };
    }

    /** Sets the focus to this item immediately after mounting. */
    public componentDidMount() {
        this.input && this.input.focus();
    }

    /**
     * Returns whether the component should update.
     *
     * @param nextPropsthe next props
     * @param nextStatethe next state
     *
     * @returnswhether the component should update
     */
    public shouldComponentUpdate(nextProps: {}, nextState: IInputItemState): boolean {
        return this.state.isInvalid !== nextState.isInvalid;
    }

    /**
     * Defines how the input item component is rendered.
     *
     * @returnsa JSX element representing the directory view
     */
    public render(): JSX.Element {
        const inputStyle: React.CSSProperties = {
            border: this.state.isInvalid ?
                `2px solid ${this.props.theme.inputItem.invalidInput}` :
                `2px solid ${this.props.theme.primaryBackgroundColour}`
        };

        const icon = this.props.creatingItemType &&
            <DirectoryItemIcon
                directoryItemType={this.props.creatingItemType}
                theme={this.props.theme} />;

        return (
            <HotKeys handlers={this.handlers}>
                <div className="Item InputItem">
                    {icon}
                    <input type="text"
                        style={inputStyle}
                        ref={input => this.input = input}
                        onKeyUp={this.handleKeyUp} />
                </div>
            </HotKeys>);
    }

    /**
     * Handles interpreting the input value on key up.
     *
     * @param eventan event raised on key up
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

        throw new LoggedError("No callback function passed to InputItem component");
    }

    /**
     * Handles sending a create item request up to the parent component.
     *
     * @param eventan event raised on key up
     *
     * @requirethis.input && this.props.sendUpCreateItem
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
     * @param eventan event raised on key up
     *
     * @requirethis.input && this.props.sendUpRenameItem
     */
    private handleRename(event: React.KeyboardEvent<HTMLInputElement>) {
        if (!this.props.sendUpRenameItem) {
            throw new LoggedError("sendUpRenameItem is not defined");
        }

        if (event.key === "Enter") {
            if (!this.props.thisItem) {
                throw new LoggedError("thisItem is not defined");
            }

            return this.props.sendUpRenameItem(this.props.thisItem.name, this.input!.value);

        } else if (event.key === "Escape") {
            return this.props.sendUpRenameItem();
        }
    }

    /**
     * Validates the given content.
     *
     * @param contentthe content to validate
     *
     * @returnswhether the given content is valid
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
