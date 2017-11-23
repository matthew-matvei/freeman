import fs from "fs";
import path from "path";
import { ItemType } from "types";

/**
 * Provides static methods for writing to and creating files and folders.
 */
class DirectoryWriter {

    /**
     * Creates an item with itemName of itemType at itemPath.
     *
     * @param itemName - the name of the item to be created
     * @param itemPath - the path to the item to be created
     * @param itemType - the type of the item to be created
     */
    public static createItem(itemName: string, itemPath: string, itemType: ItemType) {
        const fullItemName = path.join(itemPath, itemName);
        if (itemType === "folder") {
            fs.mkdir(fullItemName, error => {
                console.error(error);
            });
        } else {
            fs.writeFile(fullItemName, "", error => {
                if (error) {
                    console.error(error);
                }
            });
        }
    }

    /**
     * Renames an item with oldName to newName at itemPath.
     *
     * @param oldName - the previous name
     * @param newName - the new name
     * @param itemPath - the path to the item to be renamed
     */
    public static renameItem(oldName: string, newName: string, itemPath: string) {
        fs.rename(path.join(itemPath, oldName), path.join(itemPath, newName), error => {
            if (error) {
                console.error(error);
            }
        })
    }
}

export default DirectoryWriter;
