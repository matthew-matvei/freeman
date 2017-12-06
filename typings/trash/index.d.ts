declare module "trash" {

    interface TrashOptions {
        glob: boolean;
    }

    function trash(iterable: Iterable<string>, opts?: TrashOptions): Promise<void>;

    export default trash;
}
