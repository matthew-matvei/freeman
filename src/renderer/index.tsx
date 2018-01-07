import "reflect-metadata";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { remote } from "electron";
import log from "electron-log";
import installExtension, { REACT_DEVELOPER_TOOLS } from "electron-devtools-installer";

import { App } from "components";
import Utils from "Utils";

import "styles/main.scss";

installExtension(REACT_DEVELOPER_TOOLS)
    .then(name => log.info("Installed plugin", name))
    .catch(error => log.error(error));

if (remote.process.env.VERBOSE) {
    process.env.VERBOSE = 1;
    Utils.trace("Running renderer in verbose mode");
}

window.addEventListener("error", (event) => {
    log.error(event.error);
});

ReactDOM.render(<App />, document.getElementById("app-root"));
