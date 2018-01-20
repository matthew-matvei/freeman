import { SocketMessageType } from "types";

/** Describes a complex (non-string) socket message. */
interface ISocketMessage {

    /** The type of the message. */
    messageType: SocketMessageType;

    /** The payload of the message, dependent on the messageType. */
    payload: {
        [key: string]: number
    };
}

export default ISocketMessage;
