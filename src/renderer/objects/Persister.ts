import Config from "electron-config";
import { injectable } from "inversify";

import { IPersister } from "objects";

/** Provides methods for storing and retrieving internal state of the application for persistence. */
@injectable()
class Persister implements IPersister {

    /** The underlying config object used for persisting internal application state. */
    private readonly config: Config;

    /** Initialises a new instance of the Persister class. */
    constructor() {
        this.config = new Config({
            name: "freeman.internal.state"
        });
    }

    /** @inheritDoc */
    public set(key: string, value: any): void {
        this.config.set(key, value);
    }

    /** @inheritDoc */
    public get(key: string): any {
        return this.config.get(key);
    }
}

export default Persister;
