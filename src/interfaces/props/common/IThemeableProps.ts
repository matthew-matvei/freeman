import { ITheme } from "models";

/** Describes properties for components that can be applied with a theme. */
interface IThemeableProps {

    /** The theme to apply to the component. */
    theme: ITheme;
}

export default IThemeableProps;
