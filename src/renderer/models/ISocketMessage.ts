import { MessageType } from "types";

/** Describes a complex (non-string) socket message. */
interface ISocketMessage {

    /** The type of the message. */
    messageType: MessageType;

    /** The payload of the message, dependent on the messageType. */
    payload: {
        [key: string]: number
    }
}

export default ISocketMessage;
