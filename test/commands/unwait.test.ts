const cache = require("../../src/utils/cache");
const STRINGS = require("../../src/strings/index");
const unwait = require("../../src/commands/unwait");
const wait = require("../../src/commands/wait");

const msg = require("../__mocks__/Message");

beforeEach(() => {
    msg.channel.send.mockClear();
})

it("test unwait command", async () => {
    await wait.execute({
        ...msg,
    });

    expect(cache.waiting.get(msg.channel.id)).toMatchObject([msg.member]);

    await unwait.execute({
        ...msg,
    });

    expect(cache.waiting.get(msg.channel.id)).toEqual(undefined);


    expect(msg.channel.send).toHaveBeenCalledTimes(2);
    expect(msg.channel.send).toHaveBeenCalledWith(STRINGS.C_UNWAIT_SUCCESS.complete(msg.channel.name));

});

it("test unwait command not listed", async () => {
    await unwait.execute({
        ...msg,
    });

    expect(cache.waiting.get(msg.channel.id)).toEqual(undefined);

    expect(msg.channel.send).toHaveBeenCalledTimes(1);
    expect(msg.channel.send).toHaveBeenCalledWith(STRINGS.C_UNWAIT_E_NOT_LISTED.complete(msg.channel.name));

});

export {};
