const regex = require("../../src/utils/regex");

test("check valid regex", () => {
    expect(regex.isValid("\\w*stabis\\b")).toBeTruthy();
});

test("check not valid regex", () => {
    expect(regex.isValid(":)")).toBeFalsy();
});

test("check is safe", () => {
    expect(regex.isSafe("\\w*stabis\\b")).toBeTruthy();
});

test("check is not safe", () => {
    expect(regex.isSafe("(x+x+)+y")).toBeFalsy();
});

test("check matches everything", () => {
    expect(regex.matchesEverything(".*")).toBeTruthy();
});

test("check matches not everything", () => {
    expect(regex.matchesEverything("\\w*stabis\\b")).toBeFalsy();
});
