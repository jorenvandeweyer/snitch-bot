const STRINGS = require("../../src/strings/index");
const help = require("../../src/commands/help");

const msg = {
    author: {
        send: jest.fn()
    }
};

it("test help command", async () => {
    await help.execute({
        ...msg
    });

    expect(msg.author.send).toHaveBeenCalledTimes(1);
    expect(msg.author.send.mock.calls[0][0].description).toBe(STRINGS.HELP.join("\n"));    
});

export {};
