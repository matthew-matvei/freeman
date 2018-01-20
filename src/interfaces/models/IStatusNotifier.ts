interface IStatusNotifier {
    notify(message: string): void;

    setItemCount(itemCount: number): void;

    setChosenCount(chosenCount: number): void;
}

export default IStatusNotifier;
