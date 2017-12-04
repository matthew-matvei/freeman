declare module "hidefile" {
    export function hide(path: string, callback: (err: any, newpath: string) => void);
    export function hideSync(path: string): string;
    export function isDotPrefixed(path: string): boolean;
    export function isHidden(path: string, callback: (err: any, result: boolean) => void);
    export function isHiddenSync(path: string): boolean;
    export function reveal(path: string, callback: (err: any, newpath: string) => void);
    export function revealSync(path: string): string;
    export function shouldBeHidden(path: string, callback: (err: any, result: boolean) => void);
    export function shouldBeHiddenSync(path: string): boolean;
}
