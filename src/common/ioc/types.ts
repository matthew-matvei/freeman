/** An object of globally registerable, injectable types. */
const TYPES = {
    IAttributesManager: Symbol.for("IAttributesManager"),
    IDirectoryManager: Symbol.for("IDirectoryManager"),
    IFileSystemWrapper: Symbol.for("IFileSystemWrapper"),
    IKeysManager: Symbol.for("IKeysManager"),
    ISettingsManager: Symbol.for("ISettingsManager"),
    IShell: Symbol.for("IShell"),
    IThemesManager: Symbol.for("IThemesManager")
};

export default TYPES;
