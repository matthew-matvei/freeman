import LoggedError from "errors/LoggedError";
import { ISocketMessage } from "models";

/** Returns whether the given obj adheres to the ISocketMessage interface. */
export const isISocketMessage = (obj: any): obj is ISocketMessage => {
    if (!obj) {
        throw new LoggedError("Given object undefined or null");
    }

    return obj.messageType !== undefined && obj.payload !== undefined;
};
