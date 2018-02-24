/** An object of globally registerable, injectable types. */
const TYPES = {
    IDirectoryManager: Symbol.for("IDirectoryManager"),
    ISettingsManager: Symbol.for("ISettingsManager"),
    IKeysManager: Symbol.for("IKeysManager"),
    IThemesManager: Symbol.for("IThemesManager"),
    IAttributesManager: Symbol.for("IAttributesManager")
};

export default TYPES;
