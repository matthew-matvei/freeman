import ElectronConfig from "electron-config";
import { injectable } from "inversify";

import { IPersister } from "objects";

/** Provides methods for storing and retrieving internal state of the application for persistence. */
@injectable()
class Persister implements IPersister {

    /** The underlying config object used for persisting internal application state. */
    private readonly config: ElectronConfig;

    /** Initialises a new instance of the Persister class. */
    constructor() {
        this.config = new ElectronConfig({
            name: "freeman.internal.state"
        });
    }

    /** @inheritDoc */
    public set<T>(key: string, value: T): void {
        this.config.set(key, value);
    }

    /** @inheritDoc */
    public get<T>(key: string): T {
        return this.config.get(key) as T;
    }
}

export default Persister;
