/** Describes confirmation-related application settings. */
interface IConfirmationSettings {

    /** Whether the user must confirm before sending items to trash. */
    requiredBeforeTrash: boolean;

    /** Whether the user must confirm before permanently deleting items. */
    requiredBeforeDeletion: boolean;
}

export default IConfirmationSettings;
