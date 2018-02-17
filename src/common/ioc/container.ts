import { Container } from "inversify";

import TYPES from "ioc/types";
import {
    DirectoryManager,
    IDirectoryManager,
    IKeysManager,
    ISettingsManager,
    IThemesManager,
    KeysManager,
    SettingsManager,
    ThemesManager
} from "managers";

const container = new Container({ defaultScope: "Singleton" });

container.bind<IDirectoryManager>(TYPES.IDirectoryManager)
    .to(DirectoryManager).inTransientScope();
container.bind<ISettingsManager>(TYPES.ISettingsManager).to(SettingsManager);
container.bind<IKeysManager>(TYPES.IKeysManager).to(KeysManager);
container.bind<IThemesManager>(TYPES.IThemesManager).to(ThemesManager);

export default container;
