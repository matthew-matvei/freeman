/** Describes properties of the status component. */
interface IStatus {

    /** The message to be displayed in the Status component. */
    message: string;

    /** The number of directory items in the currently-focused directory list. */
    itemCount: number;

    /** The number of chosen items in the currently-focused directory list. */
    chosenCount: number;
}

export default IStatus;
