const cache = require("../../src/utils/cache");
const member = require("../../src/utils/extractors/member");
const STRINGS = require("../../src/strings/index");
const list = require("../../src/commands/list");
jest.mock("../../src/utils/cache");
jest.mock("../../src/utils/extractors/member");

const msg = require("../__mocks__/Message");

beforeEach(() => {
    msg.member.send.mockClear();
    cache.getTriggers.mockClear();
    cache.getIgnores.mockClear();
    member.mockClear();
});

it("test list command", async () => {
    cache.getTriggers.mockImplementationOnce(() => {
        return Promise.resolve([
            {
                keyword: "hello",
                regex: true,
            },
            {
                keyword: "test",
                regex: false,
            }
        ]);
    });

    cache.getIgnores.mockImplementationOnce(() => {
        return Promise.resolve([
            {
                user: "1",
                ignore: "2",
            }
        ]);
    });

    member.mockImplementationOnce(() => {
        return Promise.resolve({
            user: {
                id: "2",
                tag: "Ecstabis#0001"
            }
        });
    });

    await list.execute({
        ...msg,
    });

    expect(msg.member.send).toHaveBeenCalledTimes(1);
    // expect(msg.member.send).toHaveBeenCalledWith(STRINGS.C_LIST_SUCCESS);

    expect(cache.getTriggers).toHaveBeenCalledTimes(1);
    expect(cache.getTriggers).toHaveBeenCalledWith(msg.guild.id, msg.author.id);


    expect(cache.getIgnores).toHaveBeenCalledTimes(1);
    expect(cache.getIgnores).toHaveBeenCalledWith(msg.guild.id, msg.author.id);
});

it("test list command empty", async () => {
    cache.getTriggers.mockImplementationOnce(() => {
        return Promise.resolve([]);
    });

    cache.getIgnores.mockImplementationOnce(() => {
        return Promise.resolve([
            {
                user: "1",
                ignore: "2",
            }
        ]);
    });

    member.mockImplementationOnce(() => {
        return Promise.resolve({
            user: {
                id: "2",
                tag: "Ecstabis#0001"
            }
        });
    });

    await list.execute({
        ...msg,
    });

    expect(msg.member.send).toHaveBeenCalledTimes(1);
    expect(msg.member.send).toHaveBeenCalledWith(STRINGS.C_LIST_E_EMPTY);

    expect(cache.getTriggers).toHaveBeenCalledTimes(1);
    expect(cache.getTriggers).toHaveBeenCalledWith(msg.guild.id, msg.author.id);


    expect(cache.getIgnores).toHaveBeenCalledTimes(1);
    expect(cache.getIgnores).toHaveBeenCalledWith(msg.guild.id, msg.author.id);
});

export {};
