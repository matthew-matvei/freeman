/** An object of globally registerable, injectable types. */
const TYPES = {
    IAttributesManager: Symbol.for("IAttributesManager"),
    IDirectoryManager: Symbol.for("IDirectoryManager"),
    IKeysManager: Symbol.for("IKeysManager"),
    ISettingsManager: Symbol.for("ISettingsManager"),
    IThemesManager: Symbol.for("IThemesManager")
};

export default TYPES;
