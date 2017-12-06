/** Describes which side the directory pane is on. */
export type DirectoryPaneSide = "left" | "right";

/** Describes directory navigation directions. */
export type DirectoryDirection = "up" | "down";

/** The type of a directory item. */
export type ItemType = "file" | "folder";

/** A terminal socket message type. */
export type MessageType = "resize";

/** The action type requested of the clipboard. */
export type ClipboardAction = "copy" | "cut";
