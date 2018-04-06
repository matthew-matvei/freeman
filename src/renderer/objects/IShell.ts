interface IShell {
    spawn(): void;
    write(data: any): void;
    resize(columns: number, rows: number): void;
}

export default IShell;
