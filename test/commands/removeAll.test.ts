const cache = require("../../src/utils/cache");
const STRINGS = require("../../src/strings/index");
const removeAll = require("../../src/commands/removeAll");
jest.mock("../../src/utils/cache");

const msg = require("../__mocks__/Message");

beforeEach(() => {
    msg.channel.send.mockClear();
    cache.delTrigger.mockClear();
});

it("test remove command", async () => {
    cache.delTriggersOf.mockImplementationOnce(() => {
        return Promise.resolve();
    });
    cache.delIgnoresOf.mockImplementationOnce(() => {
        return Promise.resolve();
    });

    await removeAll.execute({
        ...msg
    });

    expect(msg.channel.send).toHaveBeenCalledTimes(1);
    expect(msg.channel.send).toHaveBeenCalledWith(STRINGS.C_REMOVEALL_SUCCESS);
    
    expect(cache.delTriggersOf).toHaveBeenCalledTimes(1);
    expect(cache.delTriggersOf).toHaveBeenCalledWith("0", "1");

    expect(cache.delIgnoresOf).toHaveBeenCalledTimes(1);
    expect(cache.delIgnoresOf).toHaveBeenCalledWith("0", "1");
});

export {};

