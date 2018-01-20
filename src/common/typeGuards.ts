import { ISocketMessage } from "models";

/** Returns whether the given obj adheres to the ISocketMessage interface. */
export const isISocketMessage = (obj: any): obj is ISocketMessage => {
    return obj.messageType !== undefined && obj.payload !== undefined;
};
