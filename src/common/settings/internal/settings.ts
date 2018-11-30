import { ICommonSettings } from "models/settings";

export default {
    confirmation: {
        requiredBeforeDeletion: true,
        requiredBeforeTrash: true
    },
    linux: {
        shell: "bash"
    },
    persist: {
        storeLastOpenDirectory: false
    },
    terminal: {
        cursorBlink: true,
        displayAtStartup: undefined,
        syncNavigation: true
    },
    themeName: "dark",
    windows: {
        hideUnixStyleHiddenItems: false,
        shell: "powershell.exe"
    }
} as ICommonSettings;
