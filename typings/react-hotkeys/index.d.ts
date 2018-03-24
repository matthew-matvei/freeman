import { Component, Props } from 'react';

declare module "react-hotkeys" {
    interface HotKeysProps extends Props<HotKeys> {
        onFocus?: Function;
        onBlur?: Function;
        keyMap?: Object;
        handlers?: Object;
        focused?: boolean;
        attach?: any;
        className?: string;
    }

    export class HotKeys extends Component<HotKeysProps, {}> { }
}


