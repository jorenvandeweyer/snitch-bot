const cache = require("../../src/utils/cache");
const STRINGS = require("../../src/strings/index");
const addRegex = require("../../src/commands/addRegex");
jest.mock("../../src/utils/cache");

const msg = require("../__mocks__/Message");

beforeEach(() => {
    msg.channel.send.mockClear();
    cache.setTrigger.mockClear();
});

it("test addRegex command", async () => {
    const keyword = "\\w*stabis\\b";

    cache.setTrigger.mockImplementationOnce(() => {
        return Promise.resolve({
            added: true
        });
    });

    await addRegex.execute({
        ...msg,
        command: {
            params: [keyword]
        }
    });

    expect(msg.channel.send).toHaveBeenCalledTimes(1);
    expect(msg.channel.send).toHaveBeenCalledWith(STRINGS.C_ADDREGEX_SUCCESS.complete(keyword));

    expect(cache.setTrigger).toHaveBeenCalledTimes(1);
    expect(cache.setTrigger).toHaveBeenCalledWith(msg.guild.id, msg.author.id, keyword, true);
});

it("test addRegex command duplicate", async () => {
    const keyword = "\\w*stabis\\b";

    cache.setTrigger.mockImplementationOnce(() => {
        return Promise.resolve({
            exists: true
        });
    });

    await addRegex.execute({
        ...msg,
        command: {
            params: [keyword]
        }
    });

    expect(msg.channel.send).toHaveBeenCalledTimes(1);
    expect(msg.channel.send).toHaveBeenCalledWith(STRINGS.C_ADDREGEX_E_DUPLICATE.complete(keyword));

    expect(cache.setTrigger).toHaveBeenCalledTimes(1);
    expect(cache.setTrigger).toHaveBeenCalledWith(msg.guild.id, msg.author.id, keyword, true);
});

it("test addRegex command error length", async () => {
    const keyword = "this-is-20charactersthis-is-20charactersthis-is-20charactersthis-is-20charactersthis-is-20characters";

    await addRegex.execute({
        ...msg,
        command: {
            params: [keyword]
        }
    });

    expect(msg.channel.send).toHaveBeenCalledTimes(1);
    expect(msg.channel.send).toHaveBeenCalledWith(STRINGS.C_ADDREGEX_E_LENGTH);

    expect(cache.setTrigger).toHaveBeenCalledTimes(0);
});

it("test addRegex command error invalid", async () => {
    const keyword = ":)";

    await addRegex.execute({
        ...msg,
        command: {
            params: [keyword]
        }
    });

    expect(msg.channel.send).toHaveBeenCalledTimes(1);
    expect(msg.channel.send).toHaveBeenCalledWith(STRINGS.C_ADDREGEX_E_INVALID.complete(keyword));

    expect(cache.setTrigger).toHaveBeenCalledTimes(0);
});

it("test addRegex command error unsafe", async () => {
    const keyword = "(x+x+)+y";

    await addRegex.execute({
        ...msg,
        command: {
            params: [keyword]
        }
    });

    expect(msg.channel.send).toHaveBeenCalledTimes(1);
    expect(msg.channel.send).toHaveBeenCalledWith(STRINGS.C_ADDREGEX_E_UNSAFE.complete(keyword));

    expect(cache.setTrigger).toHaveBeenCalledTimes(0);
});

it("test addRegex command error matches everything", async () => {
    const keyword = ".*";

    await addRegex.execute({
        ...msg,
        command: {
            params: [keyword]
        }
    });

    expect(msg.channel.send).toHaveBeenCalledTimes(1);
    expect(msg.channel.send).toHaveBeenCalledWith(STRINGS.C_ADDREGEX_E_MATCHES.complete(keyword));

    expect(cache.setTrigger).toHaveBeenCalledTimes(0);
});

export {};
