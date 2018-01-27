/** Describes an object for handling named commands. */
interface IHandlers {

    /** Commands are indexed by name, corresponding to a callback function. */
    [commandName: string]: Function;
}

export default IHandlers;
