declare module "trash" {

    interface TrashOptions {
        glob: boolean;
    }

    function trash(iterable: Iterable<string>, opts?: TrashOptions);

    export = trash;
}
