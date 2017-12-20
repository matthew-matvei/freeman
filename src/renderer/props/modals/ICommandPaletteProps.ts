import { ICloseableProps, IOpenableProps } from "props/common";
import { IApplicationCommands } from 'models';

/** Describes the properties for the CommandPalette. */
interface ICommandPaletteProps extends ICloseableProps, IOpenableProps {

    /** The application-level commands the command palette can invoke. */
    applicationCommands: IApplicationCommands;
}

export default ICommandPaletteProps;
