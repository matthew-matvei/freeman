declare module "fswin" {
    interface FsWinAttributes {
        IS_HIDDEN: boolean;
    }
    export function getAttributes(pathToItem: string, callback: (result?: FsWinAttributes) => void);
}
