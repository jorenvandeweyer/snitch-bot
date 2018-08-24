require("../../src/strings/index");

test("test prototype complete string", () => {
    expect("Hello {{}}!".complete("world")).toBe("Hello world!");
});

test("test prototype complete string", () => {
    expect("Hello {{}}, Welcome to {{}}!".complete("user", "snitch")).toBe("Hello user, Welcome to snitch!");
});
