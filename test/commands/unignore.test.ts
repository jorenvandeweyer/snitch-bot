const cache = require("../../src/utils/cache");
const member = require("../../src/utils/extractors/member");
const STRINGS = require("../../src/strings/index");
const unignore = require("../../src/commands/unignore");
jest.mock("../../src/utils/cache");
jest.mock("../../src/utils/extractors/member");

const msg = require("../__mocks__/Message");

beforeEach(() => {
    msg.channel.send.mockClear();
    cache.delIgnore.mockClear();
    member.mockClear();
});

it("test ignore command", async () => {
    const user = "69";

    cache.delIgnore.mockImplementationOnce(() => {
        return Promise.resolve({
            deleted: true
        });
    });

    member.mockImplementationOnce(() => {
        return Promise.resolve({
            user: {
                id: "69",
                tag: "Ecstabis#0001"
            }
        });
    });

    await unignore.execute({
        ...msg,
        command: {
            params: [user]
        }
    });

    expect(msg.channel.send).toHaveBeenCalledTimes(1);
    expect(msg.channel.send).toHaveBeenCalledWith(STRINGS.C_UNIGNORE_SUCCESS.complete("Ecstabis#0001"));

    expect(cache.delIgnore).toHaveBeenCalledTimes(1);
    expect(cache.delIgnore).toHaveBeenCalledWith(msg.guild.id, msg.author.id, user);

});

it("test ignore command not listed", async () => {
    const user = "69";

    cache.delIgnore.mockImplementationOnce(() => {
        return Promise.resolve({
            deleted: false
        });
    });

    member.mockImplementationOnce(() => {
        return Promise.resolve({
            user: {
                id: "69",
                tag: "Ecstabis#0001"
            }
        });
    });

    await unignore.execute({
        ...msg,
        command: {
            params: [user]
        }
    });

    expect(msg.channel.send).toHaveBeenCalledTimes(1);
    expect(msg.channel.send).toHaveBeenCalledWith(STRINGS.C_UNIGNORE_E_NOT_LISTED.complete("Ecstabis#0001"));

    expect(cache.delIgnore).toHaveBeenCalledTimes(1);
    expect(cache.delIgnore).toHaveBeenCalledWith(msg.guild.id, msg.author.id, user);

});

it("test ignore command invalid member", async () => {
    const user = "69";

    member.mockImplementationOnce(() => {
        return Promise.resolve(null);
    });

    await unignore.execute({
        ...msg,
        command: {
            params: [user]
        }
    });

    expect(msg.channel.send).toHaveBeenCalledTimes(1);
    expect(msg.channel.send).toHaveBeenCalledWith(STRINGS.INVALID_MEMBER);

    expect(cache.delIgnore).toHaveBeenCalledTimes(0);
});



export {};
