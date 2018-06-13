import settings from "electron-settings";
import { injectable } from "inversify";
import path from "path";

import { IPersister } from "objects";

/** Provides methods for storing and retrieving internal state of the application for persistence. */
@injectable()
class Persister implements IPersister {

    /** Initialises a new instance of the Persister class. */
    constructor() {
        settings.setPath(path.join(path.dirname(settings.file()), "freeman.internal.state.json"));
    }

    /** @inheritDoc */
    public set(key: string, value: any): void {
        settings.set(key, value);
    }

    /** @inheritDoc */
    public get(key: string): any {
        return settings.get(key);
    }
}

export default Persister;
