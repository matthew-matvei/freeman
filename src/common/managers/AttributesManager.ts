import * as fswin from "electron-fswin";
import { injectable } from "inversify";

import LoggedError from "errors/LoggedError";
import { IAttributesManager } from "managers";
import { IAttributes } from "models";

/** Provides methods for managing file attributes. */
@injectable()
class AttributesManager implements IAttributesManager {

    /** @inheritDoc */
    public async getAttributesAsync(pathToItem: string): Promise<IAttributes> {
        if (!fswin) {
            throw new LoggedError("Could not import electron-fswin module");
        }

        return new Promise<IAttributes>((resolve, reject) => {
            fswin.getAttributes(pathToItem, result => {
                if (!result) {
                    reject(`Could not retrieve attributes for ${pathToItem}`);
                }

                const attributes: IAttributes = {
                    hidden: result!.IS_HIDDEN
                };

                resolve(attributes);
            });
        });
    }
}

export default AttributesManager;
