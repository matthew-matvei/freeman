/** An object of globally registerable, injectable types. */
const TYPES = {
    IConfigManager: Symbol.for("IConfigManager"),
    IDirectoryManager: Symbol.for("IDirectoryManager")
}

export default TYPES;
