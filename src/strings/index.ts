interface String {
    complete(...args: Array<string>): string;
}

String.prototype.complete = function (...args: Array<string>): string {
    let string = this.toString();
    for (let arg of args) {
        string = string.replace("{{}}", arg);
    }
    return string;
};

module.exports = {
    COMMAND_ADD_SUCCESS: "Added the word **{{}}** succesfully",
    COMMAND_ADD_ERROR_EXISTS: "The word **{{}}** is already in your trigger list",
    COMMAND_ADD_ERROR_MAX_LENGTH: "Your word can't exceed the 99 character limit"
}
