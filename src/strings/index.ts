String.prototype.complete = function (...args: Array<string>): string {
    let string = this.toString();
    for (let arg of args) {
        string = string.replace("{{}}", arg);
    }
    return string;
};

const STRINGS: { [s: string]: string|string[] } = {
    FALSE_POSITIVE: "if you think this is a false positive, please report this to Ecstabis#0001 so it can be whitelisted",
    C_ADD_SUCCESS: "Added the word **{{}}** succesfully",
    C_ADD_E_DUPLICATE: "The word **{{}}** is already in your trigger list",
    C_ADD_E_LENGTH: "Your word can't exceed the 99 character limit",
    C_ADDREGEX_SUCCESS: "Added the RegExp `{{}}` succesfully",
    C_ADDREGEX_E_DUPLICATE: "The RegExp `{{}}` is already in your trigger list",
    C_ADDREGEX_E_LENGTH: "Your regex can't exceed the 99 character limit",
    C_ADDREGEX_E_INVALID: "`{{}}` is not a valid RegExp.",
    C_ADDREGEX_E_UNSAFE: "The RegExp `{{}}` is not supported by Snitch. It got flagged as a malicious RegExp, " + this.FALSE_POSITIVE,
    C_ADDREGEX_E_MATCHES: "The RegExp `{{}}` matches to much cases and got flagged as malicious, " + this.FALSE_POSITIVE,
    C_IGNORE_SUCCESS: "Ignoring **{{}}**",
    C_IGNORE_E_DUPLICATE: "You are already ignoring **{{}}**",
    C_UNIGNORE_SUCCESS: "You unignored **{{}}**",
    C_UNIGNORE_E_NOT_LISTED: "You are not ignoring **{{}}**",
    INVALID_MEMBER: "This is not a valid member",
    HELP: [
        "**listen!add [word]**",
        "**listen!remove [word]**",
        "",
        "**listen!addRegex [regexp]**",
        "**listen!removeRegex [regexp]**",
        "",
        "**listen!removeAll**",
        "",
        "**listen!ignore [userid]**",
        "**listen!unignore [userid]**",
        "",
        "**listen!list**",
        "",
        "**listen!invite**",
        "**listen!stats**",
        "",
        "Alternative prefixes",
        "`l!`, `listen!`"
    ]
};

module.exports = STRINGS;
