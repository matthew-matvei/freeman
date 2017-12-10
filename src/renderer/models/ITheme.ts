/**
 * Describes colour themes for the application.
 */
interface ITheme {

    /** The primary foreground colour. */
    primaryColour: string;

    /** The primary background colour. */
    primaryBackgroundColour: string;

    /** The colours of the Status component */
    statusBar: {
        /** The background colour of the status bar. */
        backgroundColour: string
    };

    /** The colours of the PathPanel component. */
    pathPanel: {
        /** The background colour of the path panel. */
        backgroundColour: string;
    }

    /** The colours of the DirectoryItem component. */
    directoryItem: {
        /** The foreground colour of a directory item. */
        colour: string;
        /** The background colour of a directory item. */
        backgroundColour: string;
        /** The background colour of the selected directory item. */
        selectedColour: string;
    }

    /** The colours of the QuickSelect component. */
    quickSelect: {
        /** The foreground colour of an item in the QuickSelect component. */
        colour: string;
        /** The background colour of the QuickSelect component. */
        backgroundColour: string;
        /** The background colour of the selected item in the QuickSelect component. */
        selectedColour: string;
    }
}

export default ITheme;
