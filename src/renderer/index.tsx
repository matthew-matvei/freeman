import "reflect-metadata";
import * as React from "react";
import * as ReactDOM from "react-dom";

import installExtension, { REACT_DEVELOPER_TOOLS } from "electron-devtools-installer";

import { App } from "components";

import "styles/main.scss";

installExtension(REACT_DEVELOPER_TOOLS)
    .then(name => console.log("Installed plugin", name))
    .catch(error => console.error(error));

ReactDOM.render(<App />, document.getElementById("app-root"));
