import { IKeyMap } from "models";

export default {
    activate: ["enter"],
    chooseItem: ["space"],
    copy: ["ctrl+c"],
    cut: ["ctrl+x"],
    delete: ["ctrl+del"],
    moveBack: ["left"],
    moveDown: ["down"],
    moveUp: ["up"],
    newFile: ["ctrl+n"],
    newFolder: ["ctrl+shift+n"],
    openCommandPalette: ["f1"],
    openDirectory: ["enter"],
    openGoto: ["ctrl+e"],
    openInNativeExplorer: ["ctrl+o"],
    paste: ["ctrl+v"],
    rename: ["ctrl+shift+r"],
    scrollToBottom: ["pagedown"],
    scrollToTop: ["pageup"],
    sendToTrash: ["del"],
    switchPane: ["tab"],
    toggleIntegratedTerminal: ["ctrl+`"],
    toggleShowHidden: ["ctrl+h"]
} as IKeyMap;
