import { Container } from "inversify";

import TYPES from "ioc/types";
import { ConfigManager, IConfigManager } from "configuration";
import { DirectoryManager, IDirectoryManager } from "objects/managers";

const container = new Container({ defaultScope: "Singleton" });
container.bind<IConfigManager>(TYPES.IConfigManager).to(ConfigManager);
container.bind<IDirectoryManager>(TYPES.IDirectoryManager).to(DirectoryManager);

export default container;
