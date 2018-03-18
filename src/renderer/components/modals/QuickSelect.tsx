import autobind from "autobind-decorator";
import * as React from "react";
import { HotKeys } from "react-hotkeys";
import ReactModal from "react-modal";

import { IHandlers, IKeyMap } from "models";
import { IQuickSelectProps } from "props/modals";
import { IQuickSelectState } from "states/modals";
import Utils from "Utils";

import "styles/panels/QuickSelect.scss";

/**
 * A component that handles quick selection of an arbitrary list of actions.
 */
class QuickSelect extends React.Component<IQuickSelectProps, IQuickSelectState> {

    /** A keymap for hot keys when QuickSelect focused. */
    private keyMap: IKeyMap = {
        close: ["esc"],
        complete: ["tab"],
        nextItem: ["down"],
        previousItem: ["up"],
        selectItem: ["enter"]
    };

    /** Handler functions for the given events this component handles. */
    private handlers: IHandlers = {
        close: this.closeQuickSelect,
        complete: this.completeInput,
        nextItem: this.selectNextItem,
        previousItem: this.selectPreviousItem,
        selectItem: this.handleSelectItem
    };

    /** Styles for the ReactModal component this QuickSelect utilises. */
    private styles = {
        content: {
            backgroundColor: this.props.theme.quickSelect.backgroundColour,
            border: undefined,
            borderRadius: "1px",
            bottom: undefined,
            boxShadow: "0 5px 15px black",
            color: this.props.theme.quickSelect.colour,
            left: "25%",
            padding: "20px 10px",
            right: "25%",
            top: "0"
        },
        overlay: {
            backgroundColor: "rgba(0, 0, 0, 0)"
        }
    };

    /** The input field for the QuickSelect. */
    private input?: HTMLInputElement | null;

    /**
     * Instantiates the QuickSelect component.
     *
     * @param props the properties for this component
     */
    public constructor(props: IQuickSelectProps) {
        super(props);

        this.state = {
            selectedIndex: 0
        };
    }

    /**
     * Defines how the quick select component is rendered.
     *
     * @returns a JSX element representing the quick select view
     */
    public render(): JSX.Element {
        const { selectedColour, backgroundColour } = this.props.theme.quickSelect;

        const items = this.props.initialItems.map((item, i) => {
            return this.state.selectedIndex === i ?
                <li key={item} style={{ backgroundColor: selectedColour }}>{item}</li>
                : <li key={item} style={{ backgroundColor: backgroundColour }}>{item}</li>;
        });

        return <ReactModal
            isOpen={this.props.isOpen}
            style={this.styles}
            contentLabel="Quick Select">
            <HotKeys keyMap={this.keyMap} handlers={this.handlers} focused>
                <input type="text"
                    value={this.props.inputValue}
                    onKeyUp={this.props.onKeyUp}
                    ref={input => {
                        this.input = input;
                        this.input && Utils.autoFocus(this.input);
                    }} />
                <ul>
                    {items}
                </ul>
            </HotKeys>
        </ReactModal>;
    }

    /** Handles closing the quick select component. */
    @autobind
    private closeQuickSelect() {
        this.props.onClose();
    }

    /**
     * Completes the input by sending the selected item to the parent component.
     */
    @autobind
    private completeInput() {
        const selectedItem = this.props.initialItems[this.state.selectedIndex];

        if (this.input) {
            this.input.value = selectedItem;
        }

        this.setState({ selectedIndex: 0 } as IQuickSelectState);

        this.props.onUpdate && this.props.onUpdate(selectedItem);
    }

    /** Handles the user selecting an item. */
    @autobind
    private handleSelectItem() {
        const selectedItem = this.props.initialItems[this.state.selectedIndex];

        this.props.onSelect(selectedItem);
    }

    /**
     * Handles selecting the next item. Method selects first item if the last
     * item is currently selected.
     */
    @autobind
    private selectNextItem() {
        if (this.state.selectedIndex < this.props.initialItems.length - 1) {
            this.setState(currentState => (
                {
                    selectedIndex: currentState.selectedIndex + 1
                } as IQuickSelectState));
        } else {
            this.setState({ selectedIndex: 0 } as IQuickSelectState);
        }
    }

    /** Selects the previous item in the array of items. */
    @autobind
    private selectPreviousItem() {
        if (this.state.selectedIndex > 0) {
            this.setState((currentState) => (
                {
                    selectedIndex: currentState.selectedIndex - 1
                } as IQuickSelectState));
        } else {
            this.setState({ selectedIndex: this.props.initialItems.length - 1 } as IQuickSelectState);
        }
    }
}

export default QuickSelect;
