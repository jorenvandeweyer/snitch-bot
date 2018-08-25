const cache = require("../../src/utils/cache");
const STRINGS = require("../../src/strings/index");
const remove = require("../../src/commands/remove");
jest.mock("../../src/utils/cache");

const msg = require("../__mocks__/Message");

beforeEach(() => {
    msg.channel.send.mockClear();
    cache.delTrigger.mockClear();
});

it("test remove command", async () => {
    const keyword = "test";

    cache.delTrigger.mockImplementationOnce(() => {
        return Promise.resolve({
            deleted: true
        });
    });

    await remove.execute({
        ...msg,
        command: {
            params: [keyword]
        }
    });

    expect(msg.channel.send).toHaveBeenCalledTimes(1);
    expect(msg.channel.send).toHaveBeenCalledWith(STRINGS.C_REMOVE_SUCCESS.complete(keyword));
    
    expect(cache.delTrigger).toHaveBeenCalledTimes(1);
    expect(cache.delTrigger).toHaveBeenCalledWith("0", "1", keyword, false);
});

it("test remove command not listed", async () => {
    const keyword = "test";

    cache.delTrigger.mockImplementationOnce(() => {
        return Promise.resolve({
            exists: true
        });
    });

    await remove.execute({
        ...msg,
        command: {
            params: [keyword]
        }
    });

    expect(msg.channel.send).toHaveBeenCalledTimes(1);
    expect(msg.channel.send).toHaveBeenCalledWith(STRINGS.C_REMOVE_E_NOT_LISTED.complete(keyword));

    expect(cache.delTrigger).toHaveBeenCalledTimes(1);
    expect(cache.delTrigger).toHaveBeenCalledWith("0", "1", keyword, false);
});

export {};

