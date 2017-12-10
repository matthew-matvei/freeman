import * as React from "react";
import PropTypes from "prop-types";
import Modal from "react-modal";
import autobind from "autobind-decorator";
import { HotKeys } from 'react-hotkeys';

import { IAppContext } from "models";
import { IQuickSelectProps } from "props/panels";
import { IQuickSelectState } from "states/panels";

import "styles/panels/QuickSelect.scss";

/**
 * A component that handles quick selection of an arbitrary list of actions.
 */
class QuickSelect extends React.Component<IQuickSelectProps, IQuickSelectState> {

    /** Validation for context types. */
    public static contextTypes = {
        theme: PropTypes.object
    }

    /** The global application context. */
    public context: IAppContext;

    /** A keymap for hot keys when QuickSelect focused. */
    private keyMap = {
        close: ["esc"],
        nextItem: ["tab"],
        selectItem: ["enter"]
    }

    /** Handler functions for the given events this component handles. */
    private handlers = {
        close: this.closeQuickSelect,
        nextItem: this.selectNextItem,
        selectItem: this.handleSelectItem
    }

    /** Styles for the Modal component this QuickSelect utilises. */
    private styles = {
        overlay: {
            backgroundColor: "rgba(0, 0, 0, 0)",
        },
        content: {
            backgroundColor: this.context.theme.quickSelect.backgroundColour,
            borderRadius: "1px",
            padding: "20px 10px",
            border: undefined,
            boxShadow: "0 5px 15px black",
            top: "0",
            right: "25%",
            bottom: undefined,
            left: "25%",
            color: this.context.theme.quickSelect.colour || "inherit"
        }
    }

    /**
     * Instantiates the QuickSelect component.
     *
     * @param props - the properties for this component
     * @param context - the context for this component
     */
    public constructor(props: IQuickSelectProps, context: IAppContext) {
        super(props, context);

        this.state = {
            selectedIndex: 0
        }
    }

    /**
     * Defines how the quick select component is rendered.
     *
     * @returns - a JSX element representing the quick select view
     */
    public render(): JSX.Element {
        const items = this.props.items.map((item, i) => {
            return this.state.selectedIndex === i ?
                <li key={item} style={{ backgroundColor: this.context.theme.quickSelect.selectedColour }}>{item}</li>
                : <li style={{ backgroundColor: this.context.theme.quickSelect.backgroundColour }}>{item}</li>
        });

        return <Modal
            isOpen={this.props.isOpen}
            style={this.styles}
            contentLabel="Quick Select">
            <HotKeys keyMap={this.keyMap} handlers={this.handlers}>
                <input autoFocus type="text" />
                <ul>
                    {items}
                </ul>
            </HotKeys>
        </Modal>;
    }

    /** Handles closing the quick select component. */
    @autobind
    private closeQuickSelect() {
        this.props.onClose();
    }

    /** Handles the user selecting an item. */
    @autobind
    private handleSelectItem() {
        const selectedItem = this.props.items[this.state.selectedIndex];

        this.props.onSelect(selectedItem);
    }

    /**
     * Handles selecting the next item. Method selects first item if the last
     * item is currently selected.
     */
    @autobind
    private selectNextItem() {
        if (this.state.selectedIndex < this.props.items.length - 1) {
            this.setState((currentState) => (
                {
                    selectedIndex: currentState.selectedIndex + 1
                } as IQuickSelectState));
        } else {
            this.setState({ selectedIndex: 0 } as IQuickSelectState);
        }
    }
}

export default QuickSelect;
