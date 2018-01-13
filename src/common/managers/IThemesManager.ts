import { ITheme } from "models";

/** The interface describing a ThemesManager. */
interface IThemesManager {

    /** Gets the theme retrieved by the keys manager. */
    readonly theme: ITheme;
}

export default IThemesManager;
