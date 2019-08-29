const cache = require("../../src/utils/cache");
const STRINGS = require("../../src/strings/index");
const wait = require("../../src/commands/wait");

const msg = require("../__mocks__/Message");

beforeEach(() => {
    msg.channel.send.mockClear();
})

it("test wait command", async () => {
    
    await wait.execute({
        ...msg,
    });

    expect(msg.channel.send).toHaveBeenCalledTimes(1);
    expect(msg.channel.send).toHaveBeenCalledWith(STRINGS.C_WAIT_SUCCESS.complete(msg.channel.name));

    expect(cache.waiting.get(msg.channel.id)).toMatchObject([msg.member]);
});

it("test wait command duplicate", async () => {
    await wait.execute({
        ...msg,
    });

    await wait.execute({
        ...msg,
    });

    expect(msg.channel.send).toHaveBeenCalledTimes(2);
    expect(msg.channel.send).toHaveBeenCalledWith(STRINGS.C_WAIT_E_DUPLICATE.complete(msg.channel.name));

});

it("get notif", async () => {
    await wait.execute({
        ...msg,
    });

    const m = {
        ...msg,
    };

    expect(cache.waiting.get(msg.channel.id)).toMatchObject([msg.member]);

    await m.search();

    expect(cache.waiting.get(msg.channel.id)).toEqual(undefined);

    expect(msg.member.send).toHaveBeenCalledTimes(1);
})

// cache.delWaiter()
// cache.delWaitersIn()

export {};
