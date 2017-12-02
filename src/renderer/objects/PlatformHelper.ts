/**
 * Provides static helper methods for platform dependent functionality.
 */
class PlatformHelper {

    /**
     * Returns whether the platform given is a Unix-like OS.
     *
     * @param platform - the name of the platform (e.g., "linux")
     *
     * @returns - whether the platform given is a Unix-like OS
     */
    public static isUnix(platform: string): boolean {
        const unixPlatforms = ["freebsd", "linux", "openbsd", "sunos"];

        return unixPlatforms.some(p => p === platform);
    }
}

export default PlatformHelper;
