import { ICommonSettings } from "models/settings";

export default {
    confirmation: {
        requiredBeforeDeletion: true,
        requiredBeforeTrash: true
    },
    linux: {
        shell: "bash"
    },
    maximised: false,
    terminal: {
        cursorBlink: true,
        displayAtStartup: false,
        syncNavigation: true
    },
    themeName: "dark",
    windows: {
        hideUnixStyleHiddenItems: false,
        shell: "powershell.exe"
    }
} as ICommonSettings;
