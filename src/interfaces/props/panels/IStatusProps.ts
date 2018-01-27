import { IStatus } from "models";
import { IThemeableProps } from "props/common";

/** Describes the properties of a status bar component. */
interface IStatusProps extends IStatus, IThemeableProps { }

export default IStatusProps;
