/// <reference types="react" />

declare module "react-throttle" {

    interface ReactThrottleProps extends React.Props<Throttle | Debounce> {
        time: string;
        handler: string;
    }

    class Throttle extends React.Component<ReactThrottleProps> { };

    class Debounce extends React.Component<ReactThrottleProps> { };

    export {
        Throttle,
        Debounce
    }
}
