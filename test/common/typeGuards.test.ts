import { expect } from "chai";
import "reflect-metadata";

import LoggedError from "errors/LoggedError";
import { ISocketMessage } from "models";
import { isISocketMessage } from "typeGuards";

describe("isISocketMessage typeguard", () => {
    let socketMessage: ISocketMessage;

    beforeEach(() => {
        socketMessage = {
            messageType: "resize",
            payload: {
                someKey: 0
            }
        };
    });

    it("throws LoggedError when given null", () => {
        const invalidInvoke = () => isISocketMessage(null);

        expect(invalidInvoke).to.throw(LoggedError);
    });

    it("throws LoggedError when given undefined", () => {
        const invalidInvoke = () => isISocketMessage(undefined);

        expect(invalidInvoke).to.throw(LoggedError);
    });

    it("returns false when object is missing property", () => {
        const nonSocketMessage: any = {
            messageType: "someMessageType"
        };

        expect(isISocketMessage(nonSocketMessage)).to.be.false;
    });

    it("returns true when object has extra property", () => {
        (socketMessage as any).otherProperty = "other value";

        expect(isISocketMessage(socketMessage)).to.be.true;
    });

    it("returns true when given an ISocketMessage", () => {
        expect(isISocketMessage(socketMessage)).to.be.true;
    });
});
