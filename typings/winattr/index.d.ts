declare module "winattr" {
    interface Attributes {
        archive: boolean;
        hidden: boolean;
        readonly: boolean;
        system: boolean;
    }

    class WinAttr {
        get: (path: string, callback: (err: any, attrs: Attributes) => void) => void;
        getSync: (path: string) => Attributes;
        set: (path: string, attrs: Attributes, callback: (err: any) => void) => void;
        setSync: (path: string, attrs: Attributes) => void;
    }

    const winattr: WinAttr;

    export {
        Attributes
    }

    export default winattr;
}