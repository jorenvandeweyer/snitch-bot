const safe = require("safe-regex");
const strings = [
    "This is a dummy string and likely to match",
    "98732587209834098439580398102938123",
    "smlkfqdfkaze efalzkfjezmfl aefalmzejfap",
    "AAAAAAAAAAAAAAAAA"
];

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

module.exports.matchesEverything = (regexp) => {
    try {
        const r = new RegExp(regexp);
        for (let string of strings) {
            if (!r.test(string)) return false;

        }
        return true;
    } catch (e) {
        return true;
    }
}
