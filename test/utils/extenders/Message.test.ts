const { Collection } = require("discord.js");

const { isCommand, search } = require("../../../src/utils/extenders/Message");
const database = require("../../../src/utils/database");
const cache = require("../../../src/utils/cache");
const commands = require("../../../src/utils/commands");

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

const msg = {
    id: "3",
    client: {
        metrics: {
            incH: jest.fn(),
        },
        shard: {
            id: 0
        }
    },
    author: {
        id: "0",
        tag: "SENDER#0000",
    },
    content: "",
    prefix: "",
    channel: {
        id: "2",
        type: "text",
    },
    member: {
        id: "3",
    },
    guild: {
        id: "10",
        fetchMember: jest.fn(),
        members: new Collection([["1", {
            permissionsIn: jest.fn().mockReturnValue(new Collection([["VIEW_CHANNEL", {}]])),
            send: jest.fn().mockImplementationOnce(() => {
                return Promise.resolve({
                    react: jest.fn(),
                });
            }),
            user: {
                tag: "RECEIVER#0000"
            },
        }]])
    },
    isCommand,
    search,
    command: {
        name: ""   
    },
};

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
