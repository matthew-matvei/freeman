import { IAttributes } from "models";

/** The interface describing an AttributesManager. */
interface IAttributesManager {

    /**
     * Gets pathToItem's file attributes.
     *
     * @param pathToItem the path to the directory item to get attributes for
     */
    getAttributesAsync(pathToItem: string): Promise<IAttributes>;
}

export default IAttributesManager;
