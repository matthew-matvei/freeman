/** An object of globally registerable, injectable types. */
const TYPES = {
    IDirectoryManager: Symbol.for("IDirectoryManager"),
    ISettingsManager: Symbol.for("ISettingsManager"),
    IKeysManager: Symbol.for("IKeysManager"),
    IThemesManager: Symbol.for("IThemesManager"),
    ITerminalService: Symbol.for("ITerminalService")
}

export default TYPES;
