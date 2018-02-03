declare module "file-icons-js" {
    class FileIcons {
        public static getClass(name: string): string | null;
        public static getClassWithColor(name: string): string | null;
    }

    const fileIcons = FileIcons;

    export default fileIcons;
}

