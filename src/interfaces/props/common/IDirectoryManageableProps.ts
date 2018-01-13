import { IDirectoryManager } from "managers";

/** Describes properties for a component capable of managing a directory. */
interface IDirectoryManageableProps {

    /** The directory manager the component uses. */
    directoryManager: IDirectoryManager;
}

export default IDirectoryManageableProps;
