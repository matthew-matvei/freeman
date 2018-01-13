import { Container } from "inversify";

import TYPES from "ioc/types";
import {
    DirectoryManager,
    IDirectoryManager,
    IKeysManager,
    KeysManager,
    ISettingsManager,
    IThemesManager,
    SettingsManager,
    ThemesManager
} from "managers";
import { ITerminalService, TerminalService } from "services";

const container = new Container({ defaultScope: "Singleton" });

container.bind<IDirectoryManager>(TYPES.IDirectoryManager).to(DirectoryManager);
container.bind<ISettingsManager>(TYPES.ISettingsManager).to(SettingsManager);
container.bind<IKeysManager>(TYPES.IKeysManager).to(KeysManager);
container.bind<IThemesManager>(TYPES.IThemesManager).to(ThemesManager);
container.bind<ITerminalService>(TYPES.ITerminalService).to(TerminalService);

export default container;
