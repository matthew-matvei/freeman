import { IDirectoryItem } from "models";

/** Describes options for the IDirectoryManager.ListDirectory method. */
interface IListDirectoryOptions {

    /** Whether to hide Unix-style hidden items. */
    hideUnixStyleHiddenItems?: boolean;

    /** A delegate to use to filter returned directory items. */
    filterCondition?(item: IDirectoryItem): boolean;

    /** A delegate to sort the returned directory items. */
    sort?(unsortedItems: IDirectoryItem[]): IDirectoryItem[];
}

export default IListDirectoryOptions;
