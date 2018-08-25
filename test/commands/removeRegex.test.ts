const cache = require("../../src/utils/cache");
const STRINGS = require("../../src/strings/index");
const removeRegex = require("../../src/commands/removeRegex");
jest.mock("../../src/utils/cache");

const msg = require("../__mocks__/Message");

beforeEach(() => {
    msg.channel.send.mockClear();
    cache.delTrigger.mockClear();
});

it("test removeRegex command", async () => {
    const keyword = "\\w*stabis\\b";

    cache.delTrigger.mockImplementationOnce(() => {
        return Promise.resolve({
            deleted: true
        });
    });

    await removeRegex.execute({
        ...msg,
        command: {
            params: [keyword]
        }
    });

    expect(msg.channel.send).toHaveBeenCalledTimes(1);
    expect(msg.channel.send).toHaveBeenCalledWith(STRINGS.C_REMOVEREGEX_SUCCESS.complete(keyword));

    expect(cache.delTrigger).toHaveBeenCalledTimes(1);
    expect(cache.delTrigger).toHaveBeenCalledWith("0", "1", keyword, true);
});

it("test removeRegex command not listed", async () => {
    const keyword = "\\w*stabis\\b";

    cache.delTrigger.mockImplementationOnce(() => {
        return Promise.resolve({
            deleted: false
        });
    });

    await removeRegex.execute({
        ...msg,
        command: {
            params: [keyword]
        }
    });

    expect(msg.channel.send).toHaveBeenCalledTimes(1);
    expect(msg.channel.send).toHaveBeenCalledWith(STRINGS.C_REMOVEREGEX_E_NOT_LISTED.complete(keyword));

    expect(cache.delTrigger).toHaveBeenCalledTimes(1);
    expect(cache.delTrigger).toHaveBeenCalledWith("0", "1", keyword, true);
});

export {};
