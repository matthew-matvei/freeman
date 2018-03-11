import { ICommonSettings } from "models/settings";

export default {
    confirmation: {
        requiredBeforeDeletion: true,
        requiredBeforeTrash: true
    },
    fullscreen: false,
    linux: {
        shell: "bash"
    },
    terminal: {
        cursorBlink: true,
        displayAtStartup: false
    },
    themeName: "dark",
    windows: {
        hideUnixStyleHiddenItems: false,
        shell: "powershell.exe"
    }
} as ICommonSettings;
