import * as ReactDOM from "react-dom";
import { HotKeys } from "react-hotkeys";

/**
 * Handles focusing the appropriate directory item automatically.
 *
 * @param component - the HotKeys wrapper component to call focus on
 */
export const autoFocus = (component: HotKeys) => {
    (ReactDOM.findDOMNode(component) as HTMLElement).focus();
}
