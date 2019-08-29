const { Collection } = require("discord.js");

const database = require("../../../src/utils/database");
const cache = require("../../../src/utils/cache");

const msg = require("../../__mocks__/Message");

jest.mock("../../../src/utils/database");
jest.mock("../../../src/utils/commands");

console.log = jest.fn();

beforeAll(async () => {
    database.allTriggers.mockImplementation(() => {
        return Promise.resolve([
            {
                guild: "10",
                keyword: "ecstabis",
                user: "1",
            }
        ]);
    });
    database.allIgnores.mockImplementation(() => {
        return Promise.resolve([
            {
                guild: "10",
                user: "1",
                ignore: "11"
            }
        ]);
    });
    await cache.build(new Collection([["10", {}]]));
});

beforeEach(async () => {
    msg.guild.members.get("1").send.mockClear();
});

test("iscommand", async () => {
    const m = await {
        ...msg,
        content: "l!list"
    }

    await m.isCommand();

    expect(m.command).not.toBeFalsy();
    expect(m.prefix).toBe("l!");
    expect(m.command.name).toBe("list");
});

test("iscommand false", async () => {
    const m = await {
        ...msg,
        content: "this is a regular message",
    };

    await m.isCommand();

    expect(m.command).toBeFalsy();
});

test("searchMessage", async () => {
    const m = await {
        ...msg,
        content: "hello ecstabis!",

    };

    await m.isCommand();

    m.search();

    await new Promise((resolve) => { 
        setTimeout(() => {
            resolve();
        }, 100);
    });
    expect(m.guild.members.get("1").send).toHaveBeenCalledTimes(1);
    
});

test("searchMessageIgnore", async () => {
    const m = await {
        ...msg,
        author: {
            id: "11",
            tag: "SENDER#0000",
        },
        content: "hello ecstabis!",
    }
    await m.isCommand();
    m.search();

    await new Promise((resolve) => {
        setTimeout(() => { resolve() }, 100);
    });
    expect(m.guild.members.get("1").send).not.toHaveBeenCalled();
});


test("searchMessage no hit", async () => {
    const m = await {
        ...msg,
        author: {
            id: "10",
            tag: "SENDER#0000",
        },
        content: "hello ecstabs!",
    }
    await m.isCommand();
    m.search();

    await new Promise((resolve) => {
        setTimeout(() => { resolve() }, 100);
    });
    expect(m.guild.members.get("1").send).not.toHaveBeenCalled();
});

export {}
