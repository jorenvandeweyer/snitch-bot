const cache = require("../../src/utils/cache");
const member = require("../../src/utils/extractors/member");
const STRINGS = require("../../src/strings/index");
const ignore = require("../../src/commands/ignore");
jest.mock("../../src/utils/cache");
jest.mock("../../src/utils/extractors/member");

const msg = require("../__mocks__/Message");

beforeEach(() => {
    msg.channel.send.mockClear();
    cache.setIgnore.mockClear();
    member.mockClear();
});

it("test ignore command", async () => {
    const user = "69";

    cache.setIgnore.mockImplementationOnce(() => {
        return Promise.resolve({
            added: true
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

    await ignore.execute({
        ...msg,
        command: {
            params: [user]
        }
    });

    expect(msg.channel.send).toHaveBeenCalledTimes(1);
    expect(msg.channel.send).toHaveBeenCalledWith(STRINGS.C_IGNORE_SUCCESS.complete("Ecstabis#0001"));

    expect(cache.setIgnore).toHaveBeenCalledTimes(1);
    expect(cache.setIgnore).toHaveBeenCalledWith("0", "1", "69");

});

it("test ignore command duplicate", async () => {
    const user = "69";

    cache.setIgnore.mockImplementationOnce(() => {
        return Promise.resolve({
            exists: true
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

    await ignore.execute({
        ...msg,
        command: {
            params: [user]
        }
    });

    expect(msg.channel.send).toHaveBeenCalledTimes(1);
    expect(msg.channel.send).toHaveBeenCalledWith(STRINGS.C_IGNORE_E_DUPLICATE.complete("Ecstabis#0001"));

    expect(cache.setIgnore).toHaveBeenCalledTimes(1);
    expect(cache.setIgnore).toHaveBeenCalledWith("0", "1", "69");

});

it("test ignore command invalid member", async () => {
    const user = "69";

    member.mockImplementationOnce(() => {
        return Promise.resolve(null);
    });

    await ignore.execute({
        ...msg,
        command: {
            params: [user]
        }
    });

    expect(msg.channel.send).toHaveBeenCalledTimes(1);
    expect(msg.channel.send).toHaveBeenCalledWith(STRINGS.INVALID_MEMBER);

    expect(cache.setIgnore).toHaveBeenCalledTimes(0);
});



export {};
