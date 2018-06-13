/** The interface describing a Persister. */
interface IPersister {

    /**
     * Stores the given value at the given key.
     *
     * @param key the key at which to store the given value
     * @param value any JSONifiable value to be stored
     */
    set(key: string, value: any): void;

    /**
     * Retrieves a value at the given key.
     *
     * @param key the key at which to retrieve a value
     *
     * @returns the value at the given key
     */
    get(key: string): any;
}

export default IPersister;
