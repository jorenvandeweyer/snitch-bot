const STRINGS = require("../../src/strings/index");
const invite = require("../../src/commands/invite");

const msg = {
    author: {
        send: jest.fn()
    },
    client: {
        user: {
            id: "123"
        }
    }
};

beforeEach(() => {
    msg.author.send.mockClear();
});

it("test invite command", async () => {
    await invite.execute({
        ...msg
    });

    expect(msg.author.send).toHaveBeenCalledTimes(1);
    expect(msg.author.send.mock.calls[0][0].description).toBe(STRINGS.INVITE_URL.complete(msg.client.user.id));
});

export {};
