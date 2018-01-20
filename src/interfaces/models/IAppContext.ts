import { ITheme } from "models";

/**
 * A global context shared by all consuming components.
 */
interface IAppContext {

    /**
     * The theme object to apply to the application components.
     */
    theme: ITheme;
}

export default IAppContext;
