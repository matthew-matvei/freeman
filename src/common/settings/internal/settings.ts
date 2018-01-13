import { ICommonSettings } from "models/settings";

export default {
    linux: {
        shell: "bash"
    },
    windows: {
        hideUnixStyleHiddenItems: false,
        shell: "powershell.exe"
    },
    fullscreen: false,
    themeName: "dark"
} as ICommonSettings;
