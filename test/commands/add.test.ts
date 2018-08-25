const cache = require("../../src/utils/cache");
const STRINGS = require("../../src/strings/index");
const add = require("../../src/commands/add");
jest.mock("../../src/utils/cache");

const msg = require("../__mocks__/Message");

beforeEach(() => {
    msg.channel.send.mockClear();
    cache.setTrigger.mockClear();
});

it("test add command", async () => {
    const keyword = "test";

    cache.setTrigger.mockImplementationOnce(() => {
        return Promise.resolve({
            added: true
        });
    });

    await add.execute({
        ...msg,
        command: {
            params: [keyword]
        }
    });

    expect(msg.channel.send).toHaveBeenCalledTimes(1);
    expect(msg.channel.send).toHaveBeenCalledWith(STRINGS.C_ADD_SUCCESS.complete(keyword));
    
    expect(cache.setTrigger).toHaveBeenCalledTimes(1);
    expect(cache.setTrigger).toHaveBeenCalledWith("0", "1", keyword, false);
});

it("test add command already exists", async () => {
    const keyword = "test";

    cache.setTrigger.mockImplementationOnce(() => {
        return Promise.resolve({
            exists: true
        });
    });

    await add.execute({
        ...msg,
        command: {
            params: [keyword]
        }
    });

    expect(msg.channel.send).toHaveBeenCalledTimes(1);
    expect(msg.channel.send).toHaveBeenCalledWith(STRINGS.C_ADD_E_DUPLICATE.complete(keyword));

    expect(cache.setTrigger).toHaveBeenCalledTimes(1);
    expect(cache.setTrigger).toHaveBeenCalledWith("0", "1", keyword, false);
});

it("test add command length", async () => {
    const keyword = "this-is-20charactersthis-is-20charactersthis-is-20charactersthis-is-20charactersthis-is-20characters";

    await add.execute({
        ...msg,
        command: {
            params: [keyword]
        }
    });

    expect(msg.channel.send).toHaveBeenCalledTimes(1);
    expect(msg.channel.send).toHaveBeenCalledWith(STRINGS.C_ADD_E_LENGTH);

    expect(cache.setTrigger).toHaveBeenCalledTimes(0);
});

export {};

