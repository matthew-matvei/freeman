import * as React from "react";

class ReactResizeDetector<ReactResizeDetectorProps, S>
    extends React.Component<ReactResizeDetectorProps, S> { }

interface ReactResizeDetectorProps {
    handleHeight: boolean;
    handleWeight: boolean;
}

declare module "react-resize-detector" {
    export const reactResizeDetector: ReactResizeDetector<ReactResizeDetectorProps, {}>;
}
