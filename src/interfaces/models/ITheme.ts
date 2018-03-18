/** Describes colour themes for the application. */
interface ITheme {

    /** The primary foreground colour. */
    primaryColour: string;

    /** The primary background colour. */
    primaryBackgroundColour: string;

    /** The colours of the Status component */
    statusBar: {
        /** The foreground colour of the status bar. */
        foregroundColour: string;
        /** The background colour of the status bar. */
        backgroundColour: string
    };

    /** The colours of the PathPanel component. */
    pathPanel: {
        /** The background colour of the path panel. */
        backgroundColour: string;
    };

    /** The colours of the DirectoryHeader component. */
    directoryHeader: {
        /** The foreground colour of the directory header. */
        foregroundColour: string;
        /** The background colour of the directory header. */
        backgroundColour: string;
    };

    /** The colours of the DirectoryItem component. */
    directoryItem: {
        /** The colour of a file-type directory item. */
        fileColour: string;
        /** The colour of a default file-type directory item. */
        fileIconDefaultColour: string;
        /** The colour of a folder-type directory item. */
        directoryColour: string;
        /** The colour of a folder-type directory item's icon. */
        directoryIconColour: string;
        /** The foreground colour of a chosen item. */
        chosenColour: string;
        /** The background colour of a directory item. */
        backgroundColour: string;
        /** The background colour of the selected directory item. */
        selectedColour: string;
    };

    /** The colours of the InputItem component. */
    inputItem: {
        /** The colour to show a warning of invalid input. */
        invalidInput: string;
    };

    /** The colours of the QuickSelect component. */
    quickSelect: {
        /** The foreground colour of an item in the QuickSelect component. */
        colour: string;
        /** The background colour of the QuickSelect component. */
        backgroundColour: string;
        /** The background colour of the selected item in the QuickSelect component. */
        selectedColour: string;
    };

    /** The colours of the TerminalHeader component. */
    terminalHeader: {
        /** The backgroun colour of the TerminalHeader component. */
        backgroundColour: string;
    };

    /** The colours of the TerminalPane component. */
    terminalPane: {
        /** The background colour of the TerminalPane component. */
        backgroundColour: string;
    };

    /** The colours of the resizer bars. */
    resizers: {
        /** The primary colour of the resizer bars. */
        colour: string;
    };
}

export default ITheme;
