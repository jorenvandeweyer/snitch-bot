const safe = require("safe-regex");

module.exports.isValid = (regexp) => {
    try {
        new RegExp(regexp);
        return true;
    } catch (e) {
        return false;
    }
}

module.exports.isSafe = (regexp) => {
    return safe(regexp);
};
