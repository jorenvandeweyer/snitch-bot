const STRINGS = require("../../src/strings/index");
const stats = require("../../src/commands/stats");
const db = require("../../src/utils/database");
jest.mock("../../src/utils/database");

const msg = {
    channel: {
        send: jest.fn()
    },
    client: {
        shard: {
            broadcastEval: jest.fn()
        }
    }
};

it("test help command", async () => {
    db.query.mockImplementationOnce(() => {
        return Promise.resolve([
            {
                total: 20,
            }
        ]);
    });

    msg.client.shard.broadcastEval.mockImplementationOnce(() => {
        return Promise.resolve([
            [15, 16],
            [14, 18],
        ]);
    });
    msg.client.shard.broadcastEval.mockImplementationOnce(() => {
        return Promise.resolve([
            2,
            3,
        ]);
    });

    await stats.execute({
        ...msg
    });

    expect(msg.channel.send).toHaveBeenCalledTimes(1);

    const call = msg.channel.send.mock.calls[0][0];

    expect(call.title).toBe(STRINGS.C_STATS_TITLE);  
    expect(call.fields[0].name).toBe(STRINGS.C_STATS_TITLE_TRIGGERS);  
    expect(call.fields[0].value).toBe(STRINGS.C_STATS_CONTENT_TRIGGERS.complete(20));  
    expect(call.fields[1].name).toBe(STRINGS.C_STATS_TITLE_GUILDS);  
    expect(call.fields[1].value).toBe(STRINGS.C_STATS_CONTENT_GUILDS.complete(5));  
    expect(call.fields[2].name).toBe(STRINGS.C_STATS_TITLE_USERS);  
    expect(call.fields[2].value).toBe(STRINGS.C_STATS_CONTENT_USERS.complete(63));  
});

export {};
